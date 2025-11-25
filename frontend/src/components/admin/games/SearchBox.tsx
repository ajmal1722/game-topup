"use client";

import { FiSearch } from "react-icons/fi";

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
    return (
        <div className="relative w-full md:w-64 mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
                type="text"
                placeholder="Search games..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
            />
        </div>
    );
}
