import { Router } from "express";
import {
    createProduct,
    fetchProducts,
    fetchProductById,
    updateProduct,
    deleteProduct,
    fetchProductsBySeller,
    fetchSellerProductByCategory
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute, sellerRouter } from "../middlewares/auth.middleware.js";
import { validateQuery } from "../middlewares/query,.middleware.js";

const router = new Router

router.post('/', protectRoute, sellerRouter, createProduct)


router.get('/', validateQuery, fetchProducts)
router.get('/seller', protectRoute, sellerRouter, fetchProductsBySeller)
router.get('/seller/:category', protectRoute, sellerRouter, fetchSellerProductByCategory)
router.get('/:id', fetchProductById)



router.put('/:id', protectRoute, sellerRouter, updateProduct)

router.patch('/delete/:id', protectRoute, sellerRouter, deleteProduct)




export default router   