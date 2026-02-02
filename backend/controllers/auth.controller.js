import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { redis } from "../lib/redis.js";
import User from "../models/auth.model.js";

dotenv.config()


//generate token using jsonwebtoken
const generateToken = (userId) => {
    //get token secrets from .env file
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20min" })

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

    return { accessToken, refreshToken }

}

//storing the refresh token in redis cache for faster access in the future, valid for 7 days
const storeRefreshToken = async (userId, refreshToken) => {
    redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60)
}


const setCookies = async (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 20 * 60 * 1000, // 20 minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}



export const signup = async (req, res, next) => {
    try {
        const { name, email, password, contactNumber } = req.body

        const userExists = await User.findOne({ email })

        if (userExists) return res.status(409).json({ message: 'User already exists' })

        const newUser = await User.create({ email, password, name, contactNumber })

        const { accessToken, refreshToken } = generateToken(newUser._id)

        await storeRefreshToken(newUser._id, refreshToken)

        setCookies(res, accessToken, refreshToken)

        res.send({
            data: newUser,
            succes: true
        })
    } catch (error) {
        console.warn(error.message)
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ message: 'User doesn\'t exist' })

        const validUser = await user.comparePassword(password)

        if (!validUser) return res.status(401).json({ message: 'Incorrect password. Try again.' })

        const { accessToken, refreshToken } = generateToken(user._id)

        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)


        res.send({
            data: user,
            succes: true
        })

    } catch (error) {
        console.error(error.message)
        next(error)
    }
}


export const logout = async (req, res, next) => {
    try {
        const refreshToken = res.cookie.refreshToken

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)

        }

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        res.send({ message: "User logged out successfully." })

    } catch (error) {
        console.error(error.message)
        next(error)
    }
}


export const refreshAccessToken = async (req, res, next) => {
    try {

        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedRefreshToken = await redis.get(`refresh_token:${decoded.userId}`)

        if (storedRefreshToken != refreshToken) return res.status(401).json({ message: "Invalid refresh token." })

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20min" })

        res.cookie("accessToken", accessToken, {
            httpOnly: true, // prevent XSS attacks, cross site scripting attack
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
            maxAge: 20 * 60 * 1000, // 20 minutes
        });

        res.send({ message: "Token refreshed succefully." })

    } catch (error) {
        console.error(error.message)
        next(error)
    }
}


export const getUserProfile = async (req, res, next) => {
    try {
        res.json({ data: req.user })
    } catch (error) {
       next(error)
    }
}