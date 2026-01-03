"use client";

import { clientApi } from "@/lib/http/index";
import { endpoints } from "@/config/api";
import { UserResponse, UserParams, User } from "./types";

export const usersApiClient = {
    async list(params?: UserParams, signal?: AbortSignal): Promise<UserResponse> {
        const { data } = await clientApi.get(endpoints.admin.users, { params: params as any, signal });
        return data;
    },

    async updateStatus(id: string, status: "active" | "blocked"): Promise<{ success: boolean; data: User; message: string }> {
        const { data } = await clientApi.patch(endpoints.admin.userStatus(id), { status });
        return data;
    },
};
