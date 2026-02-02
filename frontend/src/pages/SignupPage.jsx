import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Signup = () => {
  const navigate = useNavigate();

  const { signup } = useUserStore()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // Contact number validation
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else {
      const cn = formData.contactNumber.trim();
      if (!/^\+?[0-9]+$/.test(cn)) {
        newErrors.contactNumber =
          "Invalid number: only digits and optional '+' allowed";
      } else if (cn.replace(/\D/g, "").length < 7 || cn.replace(/\D/g, "").length > 15) {
        newErrors.contactNumber =
          "Contact number must be between 7 and 15 digits";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    signup(formData)
    navigate('/')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
          <UserPlus size={28} /> Sign Up
        </h1>



        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-md bg-zinc-700 text-white border ${errors.name ? "border-red-500" : "border-zinc-600"
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <label className="text-gray-300">Confirm Password</label>
            <input
              type="password"
              placeholder="********"
              value={formData.confirmPassword || ""}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-md bg-zinc-700 text-white border ${errors.confirmPassword ? "border-red-500" : "border-zinc-600"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          {/* Contact Number */}
          <div>
            <label className="text-gray-300">Contact Number</label>
            <input
              type="text"
              placeholder="+1234567890"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-md bg-zinc-700 text-white border ${errors.contactNumber ? "border-red-500" : "border-zinc-600"
                }`}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-gray-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-zinc-700 text-white border border-zinc-600"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-bold flex justify-center items-center gap-2"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-red-500 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
