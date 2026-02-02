import React from "react";

const LoadingSpinner = ({ size = 8, color = "red-600", className = "" }) => {

  return (
    <div
      className={`bg-zinc-800 border-4 border-t-${color} border-zinc-600 rounded-full animate-spin ${className} h-${size} w-${size}`}
    />
  );
};

export default LoadingSpinner;
