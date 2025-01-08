import React from 'react';

const sizeStyles = {
  "lg": "px-8 py-4 text-xl rounded-xl font-light flex items-center",
  "md": "px-4 py-2 text-md rounded-md font-light flex items-center",
  "sm": "px-2 py-1 text-sm rounded-sm",
};

const variantStyles = {
  "primary": "bg-purple-600 text-white",
  "secondary": "bg-purple-400 text-purple-600",
};

export function Button({ title, size, startIcon, variant, onClick, fullWidth }) {
  return (
    <button
      onClick={onClick}
      className={`${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? "w-full flex justify-center items-center" : ""}`}
    >
      <div className="flex items-center">
        <span className="text-xs pr-2">
          {startIcon}
        </span>
        <div className="pl-2 pr-2">
          {title}
        </div>
      </div>
    </button>
  );
}
