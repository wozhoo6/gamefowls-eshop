import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategoryStatus } from "../controllers/category.controller.js";

const router = new Router()

router.post('/', createCategory)
router.get('/', getCategories)

router.patch('/update-status/:id', updateCategoryStatus)

router.delete('/:id', deleteCategory)

export default router