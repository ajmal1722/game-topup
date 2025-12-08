"use client";

import { useState } from "react";
import FilterGroup from "./FilterGroup";
import PillItem from "./PillItem";

const TOPUP_TYPES = ["Direct Top-up", "Redeem Code", "In-game Currency"];
const GAME_CATEGORIES = ["Football", "Shooting", "Battle Royale", "RPG"];

export default function FilterSection() {
    const [topupTypes, setTopupTypes] = useState<Record<string, boolean>>({});
    const [gameCategories, setGameCategories] = useState<Record<string, boolean>>({});

    const handleTopupTypeChange = (label: string, selected: boolean) => {
        setTopupTypes((prev) => ({ ...prev, [label]: selected }));
    };

    const handleGameCategoryChange = (label: string, selected: boolean) => {
        setGameCategories((prev) => ({ ...prev, [label]: selected }));
    };

    return (
        <div className="space-y-8 text-white">
            <FilterGroup title="Top-Up Type">
                {TOPUP_TYPES.map((label) => (
                    <PillItem
                        key={label}
                        label={label}
                        selected={topupTypes[label] || false}
                        onChange={(selected) => handleTopupTypeChange(label, selected)}
                    />
                ))}
            </FilterGroup>

            <FilterGroup title="Game Category">
                {GAME_CATEGORIES.map((label) => (
                    <PillItem
                        key={label}
                        label={label}
                        selected={gameCategories[label] || false}
                        onChange={(selected) => handleGameCategoryChange(label, selected)}
                    />
                ))}
            </FilterGroup>
        </div>
    );
}
