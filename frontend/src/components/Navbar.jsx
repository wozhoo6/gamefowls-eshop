import { Link } from "react-router-dom";
import {
    ShoppingCart,
    LayoutDashboard,
    User,
    LogIn,
    UserPlus,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";

const Navbar = ({ auth }) => {
    const { user } = useUserStore()
    auth = {
        isLoggedIn: false,
        role: "customer"
    }

    return (
        <nav className="bg-zinc-900 text-gray-300 px-6 py-4 flex justify-between items-center shadow-md" >
            {/* Logo */}
            < Link to="/" className="text-2xl font-bold text-red-600" >
                CockMart
            </Link >

            {/* Links */}
            < ul className="hidden md:flex gap-8 font-medium" >
                <li>
                    <Link to="/" className="hover:text-red-500">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/breeds" className="hover:text-red-500">
                        Breeds
                    </Link>
                </li>
                <li>
                    <Link to="/equipment" className="hover:text-red-500">
                        Equipment
                    </Link>
                </li>
            </ul >

            {/* Right side buttons */}
            < div className="flex items-center gap-4" >
                {/* Not logged in */}
                {
                    !user && (
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
                    )
                }

                {/* Logged-in users */}
                {
                    user && user.role === "customer" && (
                        <>
                            <button className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
                                <ShoppingCart size={18} />
                                <span className="text-sm font-semibold">Cart</span>
                                <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold px-2 rounded-full">
                                    3
                                </span>
                            </button>

                            <Link
                                to="/account"
                                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
                            >
                                <User size={18} />
                                Account
                            </Link>
                        </>
                    )
                }

                {/* Seller */}
                {
                    user && user.role === "seller" && (
                        <>
                            <Link
                                to="/seller/dashboard"
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-md text-black font-bold"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>

                            <Link
                                to="/account"
                                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
                            >
                                <User size={18} />
                                Account
                            </Link>
                        </>
                    )
                }

                {/* Admin */}
                {
                    user && user.role === "admin" && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white font-bold"
                            >
                                <LayoutDashboard size={18} />
                                Admin Dashboard
                            </Link>

                            <Link
                                to="/account"
                                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
                            >
                                <User size={18} />
                                Account
                            </Link>
                        </>
                    )
                }
            </div >
        </nav >
    );
};

export default Navbar;
