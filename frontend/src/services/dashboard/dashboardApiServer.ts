import { serverApi } from "@/lib/http/server";
import { endpoints } from "@/config/api";
import { DashboardResponse } from "./types";

export const dashboardApiServer = {
    async get(): Promise<DashboardResponse> {
        return serverApi.get(endpoints.dashboard.root);
    },
};