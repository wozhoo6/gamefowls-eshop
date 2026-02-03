import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

// Delete all child categories recursively
const deleteChildren = async (parentId) => {
    const children = await Category.find({ parentId });
    for (const child of children) {
        await deleteChildren(child._id); // recursive deletion
        await disableProducts(child._id); // disable the product for this category
        await Category.findByIdAndDelete(child._id);
    }
};

const updateChildrenStatus = async (parentId, isActive) => {
    const children = await Category.find({ parentId });
    for (const child of children) {
        await updateChildrenStatus(child._id, isActive); // recursive status update
        await Category.findByIdAndUpdate(child._id, { isActive });
    }
}

const disableProducts = async (categoryId) => {
    await Product.updateMany(
        { categoryId },
        { isActive: false }
    )
}

export const createCategory = async (req, res, next) => {
    try {
        const { parentId, name } = req.body
        console.log(req.body)

        if (parentId) {
            const parentExists = await Category.findById(parentId)
            if (!parentExists) return res.status(404).json({ success: false, message: 'Parent category does not exist' })
        }


        //create slug from the category name
        const slug = name.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // remove special characters
            .replace(/\s+/g, '-')        // spaces → hyphen
            .replace(/-+/g, '-');        // collapse multiple hyphens

        const newCategory = await Category.create({ name, slug, parentId })

        await redis.del("categories:tree");

        res.send({ data: newCategory, success: true })
    } catch (error) {
        next(error)
    }
}


export const getCategories = async (req, res, next) => {
    try {
        const cached = await redis.get("categories:tree");

        if (cached) {
            return res.json({
                success: true,
                data: JSON.parse(cached),
                cached: true
            });
        }

        const categories = await Category.find().lean()

        const categoryMap = {}
        const processed = []

        categories.forEach(category => {
            categoryMap[category._id] = { ...category, children: [] }
        })


        categories.forEach(category => {
            if (category.parentId) {
                categoryMap[category.parentId]?.children.push(categoryMap[category._id])
            } else {
                processed.push(categoryMap[category._id])
            }
        })

        await redis.set(
            "categories:tree",
            JSON.stringify(processed),
            "EX",
            600
        );

        res.status(200).json({
            success: true,
            data: processed,
            cached: false,
        });
    } catch (error) {
        next(error)
    }
}



export const updateCategoryStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true })

        if (!updatedCategory) return res.status(404).json({ success: false, message: 'Category does not exist' })

        await updateChildrenStatus(updatedCategory._id, isActive)

        await redis.del("categories:tree");
        res.status(200).json({
            success: true,
            data: updatedCategory
        });
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}


export const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        await deleteChildren(categoryId);
        await disableProducts(categoryId)


        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        await redis.del("categories:tree");
        await redis.del("featuredProducts");


        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
