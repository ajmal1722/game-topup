"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await apiPost<{ success: boolean }>("/api/auth/login", { email, password });
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            <form onSubmit={onSubmit} className="space-y-4">
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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="text-sm mt-4">
                Don&apos;t have an account?{' '}
                <a
                    href="/signup"
                    className="text-blue-600 underline"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push("/signup");
                    }}
                >
                    Sign up
                </a>
            </p>
        </div>
    );
}
