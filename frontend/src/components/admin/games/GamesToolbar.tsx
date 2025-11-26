"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function GamesToolbar() {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Games & Pricing</h1>

            <Link
                href="/admin/games/new"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
            >
                <FiPlus size={18} /> Add Game
            </Link>
        </div>
    );
}
