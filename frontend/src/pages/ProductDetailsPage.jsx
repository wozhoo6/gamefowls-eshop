import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from '../stores/useCartSore'
import { useUserStore } from "../stores/useUserStore";


function ProductDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state.id;
  const { products, fetchProductById, loading } = useProductStore();
  const { addToCart } = useCartStore()
  const { user } = useUserStore()

  // helper to safely run find on the products store value
  const findProduct = (arr, id) => {
    if (!Array.isArray(arr)) return undefined;
    return arr.find(p => p._id === id);
  };

  // Fetch product if it's not already in the store
  useEffect(() => {
    if (!findProduct(products, productId)) {
      fetchProductById(productId);
    }
  }, [fetchProductById, products, productId]);


  // Get the product from products array
  const product = findProduct(products, productId);
  
  const handleAddToCart = async () => {
    const res = await addToCart(productId)
    if (res.err) {
      navigate('/login')
    }
  }

  if (!product) {
    return <p className="text-gray-400 text-center mt-8">Loading...</p>;
  }
  
  console.log(product)

  return (
    <div className="bg-zinc-950 text-gray-200 min-h-screen py-6 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        {/* Images */}
        <div className="md:w-1/2 rounded-lg border border-red-900 overflow-hidden h-64 md:h-96 flex items-center justify-center bg-zinc-800 text-gray-500">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>No Image Available</span>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4 md:gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600">{product.name}</h1>
          <p className="text-gray-400 whitespace-pre-line">
            {product.description}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-500">${product.price}</p>
          <p
            className={`font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
          >
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </p>

          <div className="p-4 border border-red-900 rounded-lg bg-zinc-900">
            <h3 className="text-lg font-bold text-red-600 mb-2">Seller Information</h3>
            <p>Name: {product.seller.name}</p>
            <p>Contact: {product.seller.contactNumber}</p>
            <p>Address: {product.seller.address}</p>
          </div>

          {
            (product.seller._id !== user?._id && (
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-bold w-full transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            ))
          }

        </div>
      </div>

      {/* Footer Meta */}
      <footer className="mt-12 border-t border-red-900 pt-4 text-gray-500 text-sm flex flex-col gap-1">
        <p>Product ID: {product._id} | Category ID: {product.categoryId}</p>
        <p>
          Created At: {new Date(product.createdAt).toLocaleDateString()} | Updated At:{" "}
          {new Date(product.updatedAt).toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}

export default ProductDetailsPage;
