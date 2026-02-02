import React from 'react'

const ProductCard = ({ product }) => {
    return (
        <div
            key={product.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-red-700 rounded-lg overflow-hidden transition"
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

                <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-md font-semibold">
                    View Details
                </button>
            </div>
        </div>
    )
}

export default ProductCard