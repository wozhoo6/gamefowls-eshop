import express from "express"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import errorMiddleware from "./middlewares/middlewares.js";

import authRoutes from './routes/auth.route.js'
import categoryRoutes from './routes/category.route.js'


dotenv.config()


const app = express()
const PORT = process.env.PORT

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)


app.use(errorMiddleware)

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)

    await connectDB()
})