import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()

    const goToProduct = () => {
        navigate(`/products/${product.slug}`, { state: { id: product._id } })
    }

    const imageUrl =
        product.images && product.images.length > 0
            ? product.images[0]
            : null

    return (
        <div
            onClick={goToProduct}
            className="bg-zinc-900 border border-zinc-800 hover:border-red-700 rounded-xl overflow-hidden transition cursor-pointer hover:shadow-xl group"
        >
            {/* PRODUCT IMAGE */}
            <div className="relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            {/* PRODUCT INFO */}
            <div className="p-4">
                <h4 className="font-semibold mb-1 line-clamp-2 min-h-[48px]">
                    {product.name}
                </h4>

                <p className="text-amber-500 font-bold text-lg mb-4">
                    ₱ {Number(product.price).toLocaleString()}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        goToProduct()
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold transition"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default ProductCard