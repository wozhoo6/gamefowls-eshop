import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LayoutDashboard,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartSore.js";
import AccountDropdown from "./AccountDropdown.jsx";

const Navbar = () => {
  const { user } = useUserStore();
  const { cart } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavLinks =
    location.pathname === "/login" || location.pathname === "/signup";

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-zinc-900 text-gray-300 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">
          CockMart
        </Link>

        {/* Desktop Links */}
        {!hideNavLinks && (
          <ul className="hidden md:flex gap-8 font-medium">
            <li>
              <Link to="/" className="hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-red-500">
                Products
              </Link>
            </li>
            <li>
              <Link to="/equipment" className="hover:text-red-500">
                Suppliers
              </Link>
            </li>
          </ul>
        )}

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Not logged in */}
          {!user && (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}

          {/* Logged-in customer */}
          {user && user.role === "customer" && (
            <>
              <button onClick={() => navigate('/cart')} className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
                <ShoppingCart size={18} />
                <span className="text-sm font-semibold">Cart</span>
                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 rounded-full">
                  {cart.length}
                </span>
              </button>
            </>
          )}

          {/* Seller */}
          {user && user.role === "seller" && (
            <>
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md text-black font-bold"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </>
          )}

          {/* Admin */}
          {user && user.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-bold"
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
            </>
          )}

          {user && <AccountDropdown />}

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {!hideNavLinks && (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link to="/products" onClick={() => setMobileOpen(false)}>
                Products
              </Link>
              <Link to="/equipment" onClick={() => setMobileOpen(false)}>
                Suppliers
              </Link>
            </>
          )}

          {/* Right side buttons */}
          {!user && (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={18} />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white"
                onClick={() => setMobileOpen(false)}
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}

          {user && user.role === "customer" && (
            <>
              <button onClick={() => navigate('/cart')} className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
                <ShoppingCart size={18} />
                <span className="text-sm font-semibold">Cart</span>
                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 rounded-full">
                  {cart.length}
                </span>
              </button>
            </>
          )}

          {user && user.role === "seller" && (
            <>
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md text-black font-bold"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-bold"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>

            </>
          )}

          {user && <AccountDropdown />}
        </div>
      )}
    </nav>
  );
};

export default Navbar;