"use client";

import { useMemo, useState } from "react";
import GamesToolbar from "@/components/admin/games/GamesToolbar";
import SearchBox from "@/components/admin/games/SearchBox";
import GamesTable, { GameRow } from "@/components/admin/games/GamesTable";

export default function GamesPricingPage() {
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<GameRow[]>([]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter((i) => `${i.game} ${i.denom}`.toLowerCase().includes(q));
    }, [items, search]);

    return (
        <div className="p-6 w-full">
            <GamesToolbar />

            <SearchBox value={search} onChange={setSearch} />

            <GamesTable
                items={filtered}
                onEdit={(idx) => {/* TODO: route to edit */}}
                onDelete={(idx) => {/* TODO: confirm & delete */}}
                onToggle={(idx) => {
                    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, active: !it.active } : it));
                }}
            />
        </div>
    );
}
