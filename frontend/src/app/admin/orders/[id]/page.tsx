"use client";

import { useEffect, useState, use } from "react";
import { ordersApiClient } from "@/services/orders/ordersApi.client";
import { Order } from "@/services/orders/types";
import { toast } from "react-toastify";
import Link from "next/link";
import {
    RiArrowLeftLine,
    RiFileListLine,
    RiUser3Line,
    RiShoppingBag3Line,
    RiCheckLine,
    RiCloseLine,
    RiLoader4Line
} from "react-icons/ri";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const orderId = unwrappedParams.id;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form states
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [adminNote, setAdminNote] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await ordersApiClient.getOrderDetails(orderId);
                if (res.success) {
                    setOrder(res.data);
                    setStatus(res.data.orderStatus);
                    setPaymentStatus(res.data.paymentStatus);
                    setAdminNote(res.data.adminNote || "");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const res = await ordersApiClient.adminUpdateOrder(orderId, {
                orderStatus: status,
                paymentStatus,
                adminNote
            });
            if (res.success) {
                setOrder(res.data);
                toast.success("Order updated successfully");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <RiLoader4Line className="w-10 h-10 text-secondary animate-spin" />
            </div>
        );
    }

    if (!order) return <div className="text-white">Order not found</div>;

    return (
        <div className="space-y-6 pb-20">
            <Link href="/admin/orders" className="flex items-center gap-2 text-gray-400 hover:text-white transition w-fit">
                <RiArrowLeftLine /> Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Order {order.orderId}</h1>
                    <p className="text-gray-400">Manage and update order status</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${order.orderStatus === 'completed' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                            order.orderStatus === 'processing' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                                'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                        }`}>
                        {order.orderStatus.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Order Information */}
                <div className="lg:col-span-2 space-y-6">

                    {/* User & Product Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h2 className="text-white font-bold flex items-center gap-2 mb-4">
                                <RiUser3Line className="text-secondary" />
                                Customer Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Name</p>
                                    <p className="text-white font-medium">{order.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Email</p>
                                    <p className="text-white font-medium">{order.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h2 className="text-white font-bold flex items-center gap-2 mb-4">
                                <RiShoppingBag3Line className="text-secondary" />
                                Product Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Game</p>
                                    <p className="text-white font-medium">{order.game?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase">Product</p>
                                    <p className="text-white font-medium">{order.productSnapshot.name}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase">Amount</p>
                                        <p className="text-secondary font-bold text-xl">₹{order.amount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs uppercase">Method</p>
                                        <p className="text-white font-medium">{order.paymentMethod.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account User Inputs */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h2 className="text-white font-bold flex items-center gap-2 mb-6">
                            <RiFileListLine className="text-secondary" />
                            Account Details (User Inputs)
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {order.userInputs.map((input) => (
                                <div key={input.key} className="bg-white/5 p-4 rounded-xl border border-white/10 group hover:border-secondary transition">
                                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{input.label}</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-white font-bold text-lg break-all">{input.value}</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(input.value);
                                                toast.info("Copied to clipboard");
                                            }}
                                            className="text-secondary opacity-0 group-hover:opacity-100 transition text-xs font-bold uppercase"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <h2 className="text-white font-bold mb-6">Order Timeline</h2>
                        <div className="space-y-4">
                            {order.tracking.map((track, i) => (
                                <div key={i} className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-px before:bg-white/10 last:before:hidden">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${i === order.tracking.length - 1 ? 'bg-secondary' : 'bg-white/10'}`}>
                                        <RiCheckLine className={i === order.tracking.length - 1 ? 'text-black' : 'text-gray-500'} />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="text-white text-sm font-bold uppercase tracking-wide">{track.status}</p>
                                        <p className="text-gray-400 text-sm">{track.message}</p>
                                        <p className="text-gray-500 text-xs mt-1">{new Date(track.at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-white font-bold mb-6 flex items-center gap-2">
                            Status Actions
                        </h2>

                        <div className="space-y-6">
                            {/* Order Status */}
                            <div>
                                <label className="text-gray-400 text-xs uppercase block mb-2">Order Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-secondary outline-none transition"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="pending" className="bg-primary">Pending</option>
                                    <option value="paid" className="bg-primary">Paid</option>
                                    <option value="processing" className="bg-primary">Processing</option>
                                    <option value="completed" className="bg-primary">Completed</option>
                                    <option value="cancelled" className="bg-primary">Cancelled</option>
                                    <option value="failed" className="bg-primary">Failed</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="text-gray-400 text-xs uppercase block mb-2">Payment Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-secondary outline-none transition"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                >
                                    <option value="pending" className="bg-primary">Pending</option>
                                    <option value="paid" className="bg-primary">Paid</option>
                                    <option value="failed" className="bg-primary">Failed</option>
                                    <option value="refunded" className="bg-primary">Refunded</option>
                                </select>
                            </div>

                            {/* Admin Note */}
                            <div>
                                <label className="text-gray-400 text-xs uppercase block mb-2">Internal Note / Tracking Info</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-secondary outline-none transition h-32 resize-none"
                                    placeholder="Add notes for the user or tracking ID..."
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="w-full py-4 bg-secondary text-black font-bold rounded-xl hover:bg-tertiary transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {updating ? <RiLoader4Line className="w-5 h-5 animate-spin" /> : <RiCheckLine className="w-5 h-5" />}
                                Update Order
                            </button>

                            <div className="pt-4 flex gap-2">
                                <button className="flex-1 py-3 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-bold transition flex items-center justify-center gap-1">
                                    <RiCloseLine /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
