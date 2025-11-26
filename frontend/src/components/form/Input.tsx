"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    className?: string;
}

const Input = ({
    label,
    error,
    helperText,
    required,
    className = "",
    ...props
}: InputProps) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {/* Label */}
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Input */}
            <input
                {...props}
                className={`
                    w-full px-3 py-2 rounded-lg border outline-none 
                    text-sm transition
                    border-gray-300 
                    focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                    placeholder:text-gray-400
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
                    ${className}
                `}
            />

            {/* Error */}
            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Helper Text */}
            {!error && helperText && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Input;