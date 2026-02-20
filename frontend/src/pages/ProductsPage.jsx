import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";



const ProductsPage = () => {

    const {
        categories,
        fetchAllCategories,
    } = useCategoryStore()

    const {
        products,
        fetchAllActiveProducts,
        fetchProductsByCategory
    } = useProductStore()

    const navigate = useNavigate()
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedCatName, setSelectedCatName] = useState(null)

    const toggleCategory = (categoryName) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };


    useEffect(() => {
        fetchAllCategories()
    }, [fetchAllCategories])


    useEffect(() => {
        fetchAllActiveProducts()
    }, [fetchAllActiveProducts])


    return (
        <div className="bg-zinc-950 text-gray-200 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="md:w-1/4 bg-zinc-900 border border-red-900 rounded-lg p-6 h-fit">
                    <h2 className="text-xl font-bold text-red-600 mb-6">
                        Categories
                    </h2>

                    <div className="space-y-4">
                        {categories.map((category) => (
                            <div key={category.name}>
                                <div className={`flex items-center justify-between w-full 
                                    ${selectedCatName === category.name ? 'text-red-600' : ' text-gray-600'
                                    }`}
                                >
                                    {/* Category Name Click */}
                                    <button
                                        onClick={() => {
                                            fetchProductsByCategory(category._id);
                                            setSelectedCatName(category.name);
                                            toggleCategory(category.name)
                                        }}
                                        className="text-left font-semibold hover:text-red-500 transition cursor-pointer"
                                    >
                                        {category.name}
                                    </button>

                                    {/* Toggle Icon Click Only */}
                                    <button
                                        onClick={() => toggleCategory(category.name)}
                                        className="p-1"
                                    >
                                        {openCategory === category.name ? (
                                            <ChevronDown size={18} className="hover:text-red-500 cursor-pointer" />
                                        ) : (
                                            <ChevronRight size={18} className="hover:text-red-500 cursor-pointer" />
                                        )}
                                    </button>

                                </div>

                                {openCategory === category.name && (
                                    <div className="mt-2 ml-4 space-y-2" >
                                        {category.children.map((child) => (
                                            <button
                                                key={child._id}
                                                onClick={() => { fetchProductsByCategory(child._id), setSelectedCatName(child.name) }}
                                                className={`block text-sm hover:text-red-500 cursor-pointer ${selectedCatName === child.name ? "text-red-500" : "text-gray-400"
                                                    }`}
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Clear Filter */}
                    {selectedCatName && (
                        <button
                            onClick={() => {
                                fetchAllActiveProducts(),
                                    setSelectedCatName(null)
                            }}
                            className="mt-6 text-sm text-amber-500 hover:underline"
                        >
                            Clear Filter
                        </button>
                    )}
                </aside>

                {/* Products */}
                <main className="md:w-3/4">
                    <h2 className="text-2xl font-bold text-red-600 mb-6">
                        {selectedCatName ? selectedCatName : "All Products"}
                    </h2>

                    {products.length === 0 ? (
                        <p className="text-gray-400">No products found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
