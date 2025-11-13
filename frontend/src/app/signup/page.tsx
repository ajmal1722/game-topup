"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await apiPost<{ success: boolean }>("/api/auth/register", { name, email, password });
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full border rounded px-3 py-2"
                        placeholder="••••••••"
                    />
                </div>
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </form>
            <p className="text-sm mt-4">
                Already have an account?{' '}
                <a
                    href="/login"
                    className="text-blue-600 underline"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push("/login");
                    }}
                >
                    Log in
                </a>
            </p>
        </div>
    );
}
