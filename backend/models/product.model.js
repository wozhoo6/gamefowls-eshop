import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    stock: {
      type: Number,
      default: 1
    },

    images: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product
