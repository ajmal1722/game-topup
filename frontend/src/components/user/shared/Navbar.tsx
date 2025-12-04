"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/logo-nobg.png";

import { RiMenu3Line, RiCloseLine, RiSearchLine, RiUserLine } from "react-icons/ri";

// SAMPLE GAMES LIST (Replace with your API or data)
const games = [
    { name: "Efootball 2024", slug: "efootball-2024" },
    { name: "PUBG Mobile", slug: "pubg" },
    { name: "Free Fire", slug: "free-fire" },
    { name: "MLBB", slug: "mlbb" },
    { name: "Genshin Impact", slug: "genshin" },
    { name: "Call of Duty Mobile", slug: "codm" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [gamesOpen, setGamesOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="Logo" className="h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">

                    {/* Home */}
                    <NavLink href="/" label="Home" />

                    {/* Games */}
                    <NavLink href="/categories" label="Games" />

                    {/* Blog */}
                    <NavLink href="/blog" label="Blog" />

                    {/* Search Field */}
                    <div className="relative w-52 group">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-secondary transition" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-white placeholder-gray-400
                focus:outline-none focus:border-secondary focus:shadow-[0_0_12px_rgba(255,120,0,0.4)]
                transition-all"
                        />
                    </div>

                    {/* Language / Currency */}
                    <LangCurrencySelector />

                    {/* Login / Account */}
                    <Link
                        href="/login"
                        className="px-5 py-2 bg-secondary text-black rounded-xl font-semibold hover:bg-tertiary transition"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden text-white"
                >
                    {open ? <RiCloseLine size={26} /> : <RiMenu3Line size={26} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden bg-[#0B0F1C]/95 backdrop-blur-2xl border-t border-white/10 p-6 animate-fadeIn">
                    <MobileLink href="/" label="Home" />

                    <MobileLink href="/categories" label="Games" />

                    <MobileLink href="/blog" label="Blog" />

                    {/* Login */}
                    <Link
                        href="/login"
                        className="block mt-6 w-full text-center bg-secondary py-3 rounded-xl font-semibold text-black"
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
}

/* ------------------------------- */
/* Reusable Desktop Nav Link */
/* ------------------------------- */
function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-white relative group"
        >
            {label}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

/* ------------------------------- */
/* Mobile Nav Link */
/* ------------------------------- */
function MobileLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="block text-gray-300 text-lg py-1 hover:text-secondary transition"
        >
            {label}
        </Link>
    );
}

/* ------------------------------- */
/* Language / Currency Selector */
/* ------------------------------- */
function LangCurrencySelector() {
    return (
        <div className="relative group">
            <button
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 flex items-center gap-2 hover:border-secondary transition"
            >
                🌐 EN • USD
            </button>

            <div
                className="absolute hidden group-hover:block right-0 top-12 bg-[#0B0F1C]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-40 shadow-xl"
            >
                <div className="flex flex-col gap-2 text-sm">
                    <button className="text-left hover:text-secondary">🇺🇸 English • USD</button>
                    <button className="text-left hover:text-secondary">🇮🇳 English • INR</button>
                    <button className="text-left hover:text-secondary">🇦🇪 Arabic • AED</button>
                </div>
            </div>
        </div>
    );
}