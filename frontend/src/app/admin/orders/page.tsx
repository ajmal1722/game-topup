"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Modal from "@/components/ui/Modal";
import { FiSearch } from "react-icons/fi";
import { TbReload, TbChecklist, TbClock, TbCheck, TbX } from "react-icons/tb";

export default function OrdersPage() {
    const [status, setStatus] = useState("all");
    const [viewData, setViewData] = useState<any>(null);
    const [updateData, setUpdateData] = useState<any>(null);

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-semibold mb-6">Orders</h1>

            {/* Filters + Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                {/* Status Filter */}
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 hide-scrollbar">
                    {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "Pending", icon: <TbClock /> },
                        { key: "paid", label: "Paid", icon: <TbChecklist /> },
                        { key: "inprogress", label: "In-Progress", icon: <TbReload /> },
                        { key: "completed", label: "Completed", icon: <TbCheck /> },
                        { key: "cancelled", label: "Cancelled", icon: <TbX /> },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setStatus(item.key)}
                            className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm transition
                                ${status === item.key
                                    ? "bg-black text-white border-black"
                                    : "bg-white border-gray-300 hover:bg-gray-100"}`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-300">
                <table className="w-full border-collapse min-w-[700px]">
                    <thead className="bg-gray-100 text-left text-sm text-gray-600">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Game</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <tr key={n} className="border-t border-gray-300 hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">#1020{n}</td>
                                <td className="p-4">John Doe</td>
                                <td className="p-4">Efootball 24 Coins</td>
                                <td className="p-4">₹499</td>

                                <td className="p-4">
                                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                        Pending
                                    </span>
                                </td>

                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => setViewData({ orderId: n })}
                                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => setUpdateData({ orderId: n })}
                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200 hover:bg-red-100 transition"
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* VIEW DRAWER */}
            <Drawer open={!!viewData} onClose={() => setViewData(null)}>
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>

                <div className="space-y-3 text-sm">
                    <p><strong>Order ID:</strong> #{viewData?.orderId}</p>
                    <p><strong>User:</strong> John Doe</p>
                    <p><strong>Game:</strong> Efootball 24 Coins</p>
                    <p><strong>Amount:</strong> ₹499</p>

                    <div className="mt-6">
                        <button
                            onClick={() => setViewData(null)}
                            className="px-4 py-2 rounded-lg bg-black text-white w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Drawer>

            {/* UPDATE MODAL */}
            <Modal open={!!updateData} onClose={() => setUpdateData(null)}>
                <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>

                <select className="w-full border rounded-lg p-2 mb-4">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                </select>

                <button className="w-full py-2 bg-black text-white rounded-lg">
                    Save Changes
                </button>
            </Modal>
        </div>
    );
}
