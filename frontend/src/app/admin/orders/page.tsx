"use client";

import { useEffect, useState, useCallback } from "react";
import { ordersApiClient } from "@/services/orders/ordersApi.client";
import { Order, OrderParams } from "@/services/orders/types";
import { toast } from "react-toastify";
import Link from "next/link";
import {
    RiSearchLine,
    RiFilter3Line,
    RiEyeLine,
    RiRefreshLine,
    RiShoppingBag3Line
} from "react-icons/ri";
import Pagination from "@/components/admin/shared/Pagination";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

    const fetchOrders = useCallback(async (params: OrderParams = {}) => {
        setLoading(true);
        try {
            const res = await ordersApiClient.adminGetOrders({
                page: params.page || pagination.page,
                limit: params.limit || pagination.limit,
                status: statusFilter || undefined,
                search: searchTerm || undefined,
            });
            if (res.success) {
                setOrders(res.data.orders);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, statusFilter, searchTerm]);

    useEffect(() => {
        fetchOrders({ page: 1 });
    }, [statusFilter]); // Refetch when filter changes

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders({ page: 1 });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "processing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "cancelled":
            case "failed": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "paid": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
            default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <RiShoppingBag3Line className="text-secondary" />
                        Order Management
                    </h1>
                    <p className="text-gray-400 text-sm">Review and process customer orders</p>
                </div>

                <button
                    onClick={() => fetchOrders()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition"
                >
                    <RiRefreshLine className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Order ID or Player ID..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-white focus:border-secondary transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <RiFilter3Line className="text-gray-500" />
                    <select
                        className="bg-transparent text-white text-sm focus:outline-none cursor-pointer pr-4"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="" className="bg-primary">All Status</option>
                        <option value="pending" className="bg-primary">Pending</option>
                        <option value="paid" className="bg-primary">Paid</option>
                        <option value="processing" className="bg-primary">Processing</option>
                        <option value="completed" className="bg-primary">Completed</option>
                        <option value="cancelled" className="bg-primary">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-8">
                                            <div className="h-6 bg-white/10 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No orders found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4">
                                            <span className="text-secondary font-mono font-bold">{order.orderId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">{order.user?.name}</div>
                                            <div className="text-gray-500 text-xs">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{order.productSnapshot.name}</div>
                                            <div className="text-gray-500 text-xs">{order.game?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold">₹{order.amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-2 text-secondary hover:text-tertiary transition font-semibold text-sm"
                                            >
                                                <RiEyeLine /> Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {orders.length > 0 && (
                    <div className="p-4 border-t border-white/5">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.total}
                            limit={pagination.limit}
                            onPageChange={(p) => fetchOrders({ page: p })}
                            onLimitChange={(l) => fetchOrders({ page: 1, limit: l })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
