import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartLength
} from "../controllers/cart.controller.js";
import { protectRoute, adminRoute, sellerRouter } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(protectRoute);

router.get("/", getCart);
router.get("/length", getCartLength)
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;