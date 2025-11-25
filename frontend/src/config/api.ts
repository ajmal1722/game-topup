// Centralized API configuration and endpoints

export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window !== "undefined"
        ? `${window.location.origin}`
        : "");

export const endpoints = {
    games: {
        root: "/api/games",
        byId: (id: string) => `/api/games/${id}`,
    },
    // add more domains here (products, orders, users, etc.)
};

export const apiUrl = (path: string) =>
    `${API_BASE?.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
