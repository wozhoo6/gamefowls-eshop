import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, UserCheck } from "lucide-react";
import { useUserStore } from "../stores/useUserStore.js";
import { Link, useNavigate } from "react-router-dom";

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, user } = useUserStore();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md text-gray-200"
      >
        <User size={18} />
        {user?.name || "Account"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-50">
          <Link
            to="/account"
            className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-zinc-800"
            onClick={() => setIsOpen(false)}
          >
            <UserCheck size={16} /> Account Details
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-zinc-800"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-zinc-800 rounded-b-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;