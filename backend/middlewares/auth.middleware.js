import jwt from 'jsonwebtoken'
import User from '../models/auth.model.js'


export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken

        //check if access token is still stored in cookie
        if(!accessToken) return res.status(401).json({message: 'Unauthorized Access'})
        
        //get stored data in jsonwebtoken
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        //get user details from DB using the stored userId from decoded
        const user = await User.findById(decoded.userId)

        if(!user) return res.status(404).json({message: 'User not found'})

        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}


export const adminRoute = async (req, res, next) =>{
    if(req.user && req.user.role === 'admin') next()
        else return res.status(403).json({message: 'Requires admin account'})
}