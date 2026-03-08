import { Router } from "express";
import { signup, login, logout, refreshAccessToken, getUserProfile, getSellerProfile, fetchAllSellers} from "../controllers/auth.controller.js";
import { protectRoute } from '../middlewares/auth.middleware.js'

const router = new Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', protectRoute, refreshAccessToken)


router.get('/profile', protectRoute, getUserProfile)
router.get('/seller/all', fetchAllSellers)
router.get('/seller/:id', getSellerProfile)



export default router