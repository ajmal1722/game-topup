import { clientApi } from "@/lib/http/index";
import { endpoints } from "@/config/api";
import { Order, OrderResponse, ListOrderResponse, OrderParams } from "./types";

export const ordersApiClient = {
    async create(data: {
        gameId: string;
        productId: string;
        qty: number;
        userInputs: { key: string; label: string; value: any }[];
    }): Promise<OrderResponse> {
        const { data: res } = await clientApi.post((endpoints as any).orders.base, data);
        return res;
    },

    async getMyOrders(params?: OrderParams): Promise<ListOrderResponse> {
        const { data } = await clientApi.get((endpoints as any).orders.myOrders, { params });
        return data;
    },

    async getOrderDetails(id: string): Promise<OrderResponse> {
        const { data } = await clientApi.get((endpoints as any).orders.details(id));
        return data;
    },

    async adminGetOrders(params?: OrderParams): Promise<ListOrderResponse> {
        const { data } = await clientApi.get((endpoints as any).orders.adminAll, { params });
        return data;
    },

    async adminUpdateOrder(id: string, updateData: any): Promise<OrderResponse> {
        const { data } = await clientApi.patch((endpoints as any).orders.adminUpdate(id), updateData);
        return data;
    },
};
