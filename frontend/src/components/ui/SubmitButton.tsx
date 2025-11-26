"use client";

import React from "react";

interface SubmitButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    label?: string;
    fullWidth?: boolean;
    variant?: "primary" | "secondary" | "danger";
}

const SubmitButton = ({
    isLoading = false,
    label = "Submit",
    fullWidth = true,
    variant = "primary",
    disabled,
    className = "",
    ...props
}: SubmitButtonProps) => {
    const baseStyles = `
        flex items-center justify-center gap-2
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        disabled:cursor-not-allowed
    `;

    const variantStyles = {
        primary: `bg-black text-white hover:bg-black/90 disabled:bg-black/50`,
        secondary: `bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-200/60`,
        danger: `bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50`,
    };

    const widthStyles = fullWidth ? "w-full" : "w-auto";

    return (
        <button
            type="submit"
            disabled={isLoading || disabled}
            className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${widthStyles}
                ${className}
            `}
            {...props}
        >
            {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            )}

            {isLoading ? "Processing..." : label}
        </button>
    );
};

export default SubmitButton;