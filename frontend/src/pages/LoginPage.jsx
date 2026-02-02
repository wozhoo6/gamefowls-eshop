import React, { useState } from "react";
import { LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useUserStore()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Frontend validation
    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        login(formData)


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
            <div className="max-w-md w-full bg-zinc-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
                    <LogIn size={28} /> Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-gray-300">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className={`w-full px-3 py-2 rounded-md bg-zinc-700 text-white border ${errors.email ? "border-red-500" : "border-zinc-600"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-300">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className={`w-full px-3 py-2 rounded-md bg-zinc-700 text-white border ${errors.password ? "border-red-500" : "border-zinc-600"
                                }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-bold flex justify-center items-center gap-2"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <span
                        className="text-red-500 hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
