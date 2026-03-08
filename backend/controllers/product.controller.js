import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const createProduct = async (req, res, next) => {
    try {
        const { name, images } = req.body;

        // Generate slug
        const slug = name.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        // Check if there's an active product with the same slug
        const existingActiveProduct = await Product.findOne({ slug, isActive: true });
        if (existingActiveProduct) {
            return res.status(400).json({
                success: false,
                error: "Duplicate product name"
            });
        }

        let uploadedImages = [];

        // Handle image uploads (supports single or multiple)
        if (images) {
            const imageArray = Array.isArray(images) ? images : [images];

            for (let img of imageArray) {
                const cloudinaryResponse = await cloudinary.uploader.upload(img, {
                    folder: "gamefowl_products"
                });

                uploadedImages.push(cloudinaryResponse.secure_url);
            }
        }

        // Create product
        const newProduct = await Product.create({
            ...req.body,
            slug,
            images: uploadedImages,
            seller: req.user._id
        });

        res.status(201).json({
            success: true,
            data: newProduct
        });

    } catch (error) {
        next(error);
    }
};


export const fetchProductsBySeller = async (req, res, next) => {
    try {
        const sellerId = req.params.sellerId

        const products = await Product.find({ seller: sellerId, isActive: true }).populate("seller", "name address contactNumber")
        res.send({ success: true, data: products });
    } catch (error) {
        next(error)
    }
}


export const fetchSellerProductByCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.category;
        const objectId = new mongoose.Types.ObjectId(categoryId);

        console.log(objectId)
        const childrenCategories = await Category.find({
            parentId: objectId
        }).select("_id");

        const categoryIds = [
            objectId,
            ...childrenCategories.map(cat => cat._id)
        ];

        const products = await Product.find({
            seller: req.user._id,
            categoryId: { $in: categoryIds },
            isActive: true
        });

        res.send({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

export const fetchProducts = async (req, res, next) => {
    try {
        const { category: categoryId, isFeatured, all = "false" } = req.query;

        const filter = {};

        if (all !== 'true') {
            filter.isActive = true
        }


        if (isFeatured) {
            if (!categoryId) {
                const cachedProducts = await redis.get("featuredProducts");

                if (cachedProducts) return res.send({
                    success: true,
                    data: JSON.parse(cachedProducts),
                    cached: true
                });
            }
            filter.isFeatured = isFeatured === "true"
        }


        if (categoryId) {
            const objectId = new mongoose.Types.ObjectId(categoryId);

            const childrenCategories = await Category.find({
                parentId: objectId
            }).select("_id");

            const categoryIds = [
                objectId,
                ...childrenCategories.map(cat => cat._id)
            ];

            filter.categoryId = { $in: categoryIds };
        }


        const products = await Product.find(filter).populate('seller', "name address contactNumber");

        if (isFeatured && !categoryId) {
            await redis.set(
                "featuredProducts",
                JSON.stringify(products)
            )
        }

        res.send({ success: true, data: products, cached: false });
    } catch (error) {
        next(error);
    }
};

export const fetchProductById = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id).populate('seller', "name address contactNumber")

        if (!product) return res.status(404).json({ message: "Product does not exist" })

        res.send({ success: true, data: product });

    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const existingProduct = await Product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product does not exist"
            });
        }

        let updateData = { ...req.body };

        // 🔹 Handle slug regeneration
        if (req.body.name) {
            const slug = req.body.name.toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            updateData.slug = slug;

            const duplicate = await Product.findOne({
                slug,
                isActive: true,
                _id: { $ne: req.params.id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    error: "Duplicate product name"
                });
            }
        }

        // 🔹 Handle image uploads
        if (req.body.images) {
            const imageArray = Array.isArray(req.body.images)
                ? req.body.images
                : [req.body.images];

            const uploadedImages = [];

            for (let img of imageArray) {
                // If it's already a Cloudinary URL, keep it
                if (img.startsWith("http")) {
                    uploadedImages.push(img);
                } else {
                    const upload = await cloudinary.uploader.upload(img, {
                        folder: "gamefowl_products"
                    });
                    uploadedImages.push(upload.secure_url);
                }
            }

            updateData.images = uploadedImages;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        await redis.del("featuredProducts");

        res.json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false }
    )
    if (product.isFeatured) await redis.del('featuredProducts')

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
}
