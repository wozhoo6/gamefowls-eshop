import mongoose from "mongoose";
import User from "../models/auth.model.js";
import Product from "../models/product.model.js";

/**
 * @desc    Get logged in user's cart
 */
export const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("cartItems.product");

        res.send({
            success: true,
            data: user.cartItems || []
        });
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Add product to cart
 */
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const user = await User.findById(req.user._id);

        const existingItem = user.cartItems.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cartItems.push({ product: productId, quantity });
        }

        await user.save();

        res.send({
            success: true,
            message: "Product added to cart",
            data: user.cartItems
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Update cart item quantity
 */
export const updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
        }

        const user = await User.findById(req.user._id);

        const item = user.cartItems.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }

        item.quantity = quantity;

        await user.save();

        res.send({
            success: true,
            message: "Cart updated",
            data: user.cartItems
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Remove item from cart
 */
export const removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);

        user.cartItems = user.cartItems.filter(
            item => item.product.toString() !== productId
        );

        await user.save();

        res.send({
            success: true,
            message: "Item removed from cart",
            data: user.cartItems
        });

    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Clear entire cart
 */
export const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        user.cartItems = [];
        await user.save();

        res.send({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {
        next(error);
    }
};