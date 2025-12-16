import { serverApi } from "@/lib/http/server";
import { endpoints } from "@/config/api";
import { BannerListResponse } from "./types";

export const bannerApiServer = {
    async listActive(): Promise<BannerListResponse> {
        return serverApi.get(endpoints.banners.root);
    },
};
