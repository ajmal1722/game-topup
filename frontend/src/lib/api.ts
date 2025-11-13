"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

let csrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;
    const res = await fetch(`${API_BASE}/api/auth/csrf`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch CSRF token");
    const data = await res.json();
    csrfToken = data.csrfToken;
    return csrfToken!;
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
    const token = await getCsrfToken();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "csrf-token": token,
        },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const j = await res.json();
            message = j.message || j.error || message;
        } catch { }
        throw new Error(message);
    }
    return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}
