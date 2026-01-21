import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const DB_URI = process.env.DB_URI

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connecting to MongoDB ${error.message}`)
        process.exit(1)
    }
}

