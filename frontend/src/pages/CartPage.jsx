import React, { useMemo, useEffect } from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartSore";

function CartPage() {
  const { cart,
    removeCartItem,
    fetchCart,
    loading,
    updateCartItem,
    getCartTotal,
    cartLength
  } = useCartStore();


  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-gray-400">
        Loading cart...
      </div>
    );
  }


  return (
    <div className="bg-zinc-950 text-gray-200 min-h-screen px-4 py-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Your cart is empty.
        </p>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* ================= CART ITEMS ================= */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 bg-zinc-900 border border-red-900 rounded-lg p-4"
              >
                {/* Top Section (Image + Info) */}
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                    {item.product.images?.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-red-500">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      ₱{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded"
                        onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold text-base">
                        {item.quantity}
                      </span>

                      <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded"
                        onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Section (Subtotal + Remove) */}
                <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                  <p className="font-bold text-red-400">
                    ₱
                    {(
                      item.product.price * item.quantity
                    ).toLocaleString()}
                  </p>

                  <button className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm"
                    onClick={() => removeCartItem(item._id)}
                  >
                    <Trash size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="w-full lg:w-80 bg-zinc-900 border border-red-900 rounded-lg p-5 h-fit">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-400 mb-2">
              <span>Items</span>
              <span>{cartLength}</span>
            </div>

            <div className="flex justify-between text-gray-400 mb-4">
              <span>Total</span>
              <span className="font-semibold text-white">
                ₱{getCartTotal()}
              </span>
            </div>

            <hr className="border-red-900 mb-4" />

            <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-md font-bold transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;