"use client";

import { TbPencil, TbTrash, TbToggleLeft, TbToggleRight } from "react-icons/tb";

export type GameRow = {
    game: string;
    denom: string;
    price: string;
    active: boolean;
};

interface Props {
    items: GameRow[];
    onEdit?: (index: number, item: GameRow) => void;
    onDelete?: (index: number, item: GameRow) => void;
    onToggle?: (index: number, item: GameRow) => void;
}

export default function GamesTable({ items, onEdit, onDelete, onToggle }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-left text-sm text-gray-600">
                    <tr>
                        <th className="p-4">Game</th>
                        <th className="p-4">Denomination</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {items.map((item, idx) => (
                        <tr key={idx} className="border-t border-gray-300 hover:bg-gray-50 transition">
                            <td className="p-4 font-medium">{item.game}</td>
                            <td className="p-4">{item.denom}</td>
                            <td className="p-4">{item.price}</td>
                            <td className="p-4">
                                {item.active ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <TbToggleRight size={22} /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-gray-500">
                                        <TbToggleLeft size={22} /> Inactive
                                    </span>
                                )}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => onEdit?.(idx, item)}
                                    >
                                        <TbPencil size={16} /> Edit
                                    </button>
                                    <button
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition"
                                        onClick={() => onDelete?.(idx, item)}
                                    >
                                        <TbTrash size={16} /> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
