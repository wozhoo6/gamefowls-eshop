import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//USER STORE
import { useUserStore } from "./stores/useUserStore";


//PAGES AND COMPONENTS
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner"

import Home from "./pages/Home";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const { user, checkAuth, checkingAuth } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])


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


      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
