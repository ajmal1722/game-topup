"use client";

import React from "react";

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    className?: string;
}

const Textarea = ({
    label,
    required,
    error,
    helperText,
    className = "",
    ...props
}: TextareaProps) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <textarea
                {...props}
                className={`
                    w-full px-3 py-2 rounded-lg border outline-none min-h-[100px]
                    text-sm transition resize-none
                    border-gray-300 
                    focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                    placeholder:text-gray-400
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${error ? "border-red-500 focus:ring-red-500/20" : ""}
                    ${className}
                `}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && helperText && (
                <p className="text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default Textarea;