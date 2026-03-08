import React, { useEffect } from "react";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

function SuppliersPage() {

  const { fetchAllSeller, sellers, loading } = useUserStore()

  useEffect(() => {
    fetchAllSeller()
  }, [fetchAllSeller])

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
        Suppliers
      </h1>

      {sellers.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          No suppliers found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
            <Link
              to={`/suppliers/${seller._id}`}
              key={seller._id}
              className="block bg-zinc-900 border border-red-900 rounded-lg p-5 
             hover:border-red-600 hover:scale-[1.02] transition cursor-pointer"
            >
              {/* Name */}
              <h2 className="text-lg font-semibold text-red-500 mb-3">
                {seller.name}
              </h2>

              {/* Email */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Mail size={16} />
                <span>{seller.email}</span>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Phone size={16} />
                <span>{seller.contactNumber}</span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <MapPin size={16} />
                <span>{seller.address}</span>
              </div>

              {/* Joined Date */}
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-4 border-t border-zinc-800 pt-3">
                <Calendar size={14} />
                <span>
                  Joined {new Date(seller.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuppliersPage;