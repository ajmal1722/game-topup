"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { isValidEmail, hasMinLength } from "@/utils/validation";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

    const emailValid = isValidEmail(email);
    const passwordValid = hasMinLength(password, 6);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!emailValid || !passwordValid) {
                setTouched({ email: true, password: true });
                throw new Error("Please fix the validation errors");
            }
            await login(email, password);
            toast.success("Logged in successfully");
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12">
            <h1 className="text-3xl font-semibold mb-8 text-center">Welcome back</h1>
            <form onSubmit={onSubmit} className="space-y-5 rounded-lg border p-6 bg-white">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        required
                        className={`w-full border rounded px-3 py-2 ${touched.email && !emailValid ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="you@example.com"
                    />
                    {touched.email && !emailValid && (
                        <p className="text-xs text-red-600 mt-1">Enter a valid email address</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        required
                        minLength={6}
                        className={`w-full border rounded px-3 py-2 ${touched.password && !passwordValid ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="••••••••"
                    />
                    {touched.password && !passwordValid && (
                        <p className="text-xs text-red-600 mt-1">Password must be at least 6 characters</p>
                    )}
                </div>
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
