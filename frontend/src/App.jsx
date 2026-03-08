import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//USER STORE
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartSore.js";
import { useProductStore } from "./stores/useProductStore.js";



//PAGES AND COMPONENTS
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner"

import Home from "./pages/Home";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage.jsx";
import SuppliersPage from "./pages/SuppliersPage.jsx";

import SellerProducts from "./pages/seller/SellerProducts.jsx";


const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore()
  const { getCartLength, cart } = useCartStore();
  const { fetchSellerProducts } = useProductStore()

  useEffect(() => {
    checkAuth()

  }, [checkAuth])

  useEffect(() => {
    if (user) {
      getCartLength()
    }
  }, [getCartLength, user])

  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerProducts(user._id)
    }
  }, [fetchSellerProducts, user])



  if (checkingAuth) return <LoadingSpinner />
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        {/* seller routes */}
        <Route path="/seller/dashboard" element={!user ? <Navigate to='/' /> : <SellerDashboard />} />

        {/* auth routes */}
        <Route path="/signup" element={user ? <Navigate to='/' /> : <SignupPage />} />
        <Route path="/login" element={user ? <Navigate to='/' /> : <LoginPage />} />

        <Route path="/products" element={<ProductsPage />} />

        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/suppliers/:id" element={<SellerProducts />} />


        <Route path="/products/:slug" element={<ProductDetailsPage />} />
        <Route path="/cart" element={!user ? <Navigate to='/' /> : <CartPage />} />




      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
