import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Package, Calendar } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import ProductCard from "../../components/ProductCard";

function SellerProducts() {
    const { id } = useParams();

    const { fetchSellerProducts, products } = useProductStore()


    useEffect(() => {
        fetchSellerProducts(id)
    }, [fetchSellerProducts])

    return (
        <div className="bg-zinc-950 text-gray-200 min-h-screen px-4 py-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6">
                {products[0].seller.name}
            </h1>

            {products.length === 0 ? (
                <p className="text-gray-400 text-center mt-10">
                    No products found for this seller.
                </p>
            ) : (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      xl:grid-cols-4 
      gap-5 sm:gap-6 lg:gap-8
  ">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerProducts;