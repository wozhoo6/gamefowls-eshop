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

    stock: {
      type: Number,
      default: 0
    },

    images: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
