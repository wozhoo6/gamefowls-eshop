import React, { useEffect, useState } from "react";
import {
    Users,
    Package,
    DollarSign,
    ShieldCheck,
} from "lucide-react";
import ProductManager from "../../components/seller/ProductManager";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useProductStore } from "../../stores/useProductStore";
import { useUserStore } from "../../stores/useUserStore";
import LoadingSpinner from "../../components/LoadingSpinner"


const SellerDashboard = () => {
    const {
        loading: categoriesLoading,
    } = useCategoryStore();

    const {
        products,
        fetchSellerProducts,
        loading: producLoading,
        
    } = useProductStore();

    const { user } = useUserStore()

    const loading = categoriesLoading || producLoading;

    const [initialProductCount, setInitialProductCount] = useState(0);

    useEffect(() => {
        fetchSellerProducts(user._id)
    }, [fetchSellerProducts])

    useEffect(() => {
        if (products && products.length > 0 && initialProductCount === 0) {
            setInitialProductCount(products.length);
        }
    }, [products, initialProductCount]);



    const stats = [
        {
            id: 1,
            title: "Total Listings",
            value: initialProductCount,
            icon: <Package className="text-red-500" />,
        },
        {
            id: 2,
            title: "Active Breeders",
            value: "34",
            icon: <Users className="text-amber-500" />,
        },
        {
            id: 3,
            title: "Monthly Revenue",
            value: "$12,450",
            icon: <DollarSign className="text-green-500" />,
        },
        {
            id: 4,
            title: "Verified Sellers",
            value: "22",
            icon: <ShieldCheck className="text-blue-500" />,
        },
    ];


    return (
        <div className="bg-zinc-950 min-h-screen text-gray-200 px-6 py-10">

            <>
                <h1 className="text-3xl font-extrabold text-red-600 mb-10">
                    Admin Dashboard
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center gap-4"
                        >
                            <div className="p-3 bg-zinc-800 rounded-md">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Product Management */}
                <div className="mt-12">
                    <ProductManager />
                </div>
            </>
        </div>
    );
};

export default SellerDashboard;
