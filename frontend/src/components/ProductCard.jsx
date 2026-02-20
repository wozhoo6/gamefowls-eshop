import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    
    const goToProduct = () => {
        navigate(`/products/${product.slug}`, { state: { id: product._id } })
    }

    return (
        <div
            onClick={goToProduct}
            className="bg-zinc-900 border border-zinc-800 hover:border-red-700 rounded-lg overflow-hidden transition cursor-pointer hover:shadow-lg"
        >
            <img
                // src={product.image}
                alt={product.name}
                className="h-44 w-full object-cover"
            />

            <div className="p-4">
                <h4 className="font-semibold mb-1">
                    {product.name}
                </h4>

                <p className="text-amber-500 font-bold mb-4">
                    P {product.price}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation() // 🚀 prevents card click
                        goToProduct()
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold cursor-pointer"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default ProductCard