"use client";
import { useState } from "react";
import Link from "next/link";
import { navOptions } from "@/data/navOptions";

// Icons
import {
    RiMenu3Line,
    RiCloseLine,
    RiShoppingCartLine,
    RiUserLine,
} from "react-icons/ri";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="nav-glass fixed top-0 w-full z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="text-2xl font-semibold tracking-wide">
                    <span className="text-secondary font-bold drop-shadow-md">Game</span>
                    <span className="text-white">Store</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-10 font-medium">

                    {navOptions.map((option) => (
                        <NavItem
                            key={option.name}
                            href={option.path}
                            label={option.name}
                        />
                    ))}

                    {/* Cart */}
                    <Link href="/cart" className="relative group">
                        <RiShoppingCartLine className="w-6 h-6 text-white group-hover:text-secondary transition" />
                        <span className="absolute -top-2 -right-3 bg-tertiary text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                            2
                        </span>
                    </Link>

                    {/* Profile */}
                    <Link href="/profile">
                        <RiUserLine className="w-6 h-6 text-white hover:text-secondary transition" />
                    </Link>

                    {/* Login Button */}
                    <Link href="/login" className="btn-primary text-sm">
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden text-white"
                >
                    {open ? <RiCloseLine size={28} /> : <RiMenu3Line size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96" : "max-h-0"
                }`}
            >
                <div className="bg-[#0A0F1F]/90 backdrop-blur-2xl border-t border-white/10 p-6 space-y-6 animate-fadeIn">

                    {navOptions.map((option) => (
                        <MobileItem
                            key={option.name}
                            href={option.path}
                            label={option.name}
                        />
                    ))}

                    <Link
                        href="/login"
                        className="block w-full text-center py-3 rounded-xl bg-secondary font-semibold text-white hover:opacity-90 transition"
                    >
                        Login / Signup
                    </Link>
                </div>
            </div>
        </nav>
    );
}

/* Desktop Nav Item */
function NavItem({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-white relative group tracking-wide"
        >
            {label}

            {/* Neon underline */}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full shadow-glow"></span>
        </Link>
    );
}

/* Mobile Nav Item */
function MobileItem({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="block text-white text-lg font-medium hover:text-secondary transition"
        >
            {label}
        </Link>
    );
}
