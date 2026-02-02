import React, { useEffect } from "react";
import { Shield, Swords } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../stores/useProductStore.js";



const Home = () => {
  const { fetchFeaturedProducts, featuredProducts } = useProductStore()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])


  return (
    <div className="bg-zinc-950 text-gray-200 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-black via-zinc-900 to-black py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6">
            Elite Gamefowl. Proven Bloodlines.
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-8">
            Premium breeds, top-tier equipment, and trusted suppliers for serious
            competitors.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold tracking-wide">
            ENTER MARKET
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-900 border border-red-900 p-6 rounded-lg">
          <Shield className="text-amber-500 mb-4" />
          <h4 className="font-bold text-lg mb-2">Verified Sellers</h4>
          <p className="text-gray-400 text-sm">
            Trusted breeders and suppliers only.
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-900 p-6 rounded-lg">
          <Swords className="text-amber-500 mb-4" />
          <h4 className="font-bold text-lg mb-2">Competition Ready</h4>
          <p className="text-gray-400 text-sm">
            Products tested for performance and durability.
          </p>
        </div>

        <div className="bg-zinc-900 border border-red-900 p-6 rounded-lg">
          <Shield className="text-amber-500 mb-4" />
          <h4 className="font-bold text-lg mb-2">Secure Deals</h4>
          <p className="text-gray-400 text-sm">
            Safe payments and protected transactions.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h3 className="text-2xl font-bold text-red-600 mb-8">
          Featured Listings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
