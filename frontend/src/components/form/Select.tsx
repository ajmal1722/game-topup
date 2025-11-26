"use client";

import React from "react";

interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    className?: string;
    options?: { label: string; value: string }[];
}

const Select = ({
    label,
    error,
    helperText,
    required,
    className = "",
    options = [],
    ...props
}: SelectProps) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <select
                {...props}
                className={`
                    w-full px-3 py-2 rounded-lg border outline-none 
                    text-sm transition bg-white
                    border-gray-300 
                    focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
                    ${className}
                `}
            >
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && helperText && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Select;