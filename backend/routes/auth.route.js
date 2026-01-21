import { Router } from "express";
import { signup, login, logout, refreshAccessToken } from "../controllers/auth.controller.js";
import {protectRoute} from '../middlewares/auth.middleware.js'

const router = new Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout',logout)
router.post('/refresh-token', protectRoute, refreshAccessToken)



export default router