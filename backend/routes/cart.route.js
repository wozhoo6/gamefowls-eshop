import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";
import { protectRoute, adminRoute, sellerRouter } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(protectRoute);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;