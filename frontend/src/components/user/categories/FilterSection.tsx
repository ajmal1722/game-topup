"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterGroup from "./FilterGroup";
import PillItem from "./PillItem";

const GAME_CATEGORIES = ['racing', 'action', 'social', 'story mode'];
const TOPUP_TYPES = ["Direct Top-up", "Redeem Code", "In-game Currency"];

export default function FilterSection() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategory = searchParams.get("category") || "";

    const handleCategorySelect = (label: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // If user selects same category again → remove filter
        if (label === selectedCategory) {
            params.delete("category");
        } else {
            params.set("category", label);
        }

        params.set("page", "1"); // reset page on filter change

        router.push(`/categories?${params.toString()}`);
    };

    return (
        <div className="space-y-8 text-white">
            <FilterGroup title="Game Category">
                {GAME_CATEGORIES.map((label) => (
                    <PillItem
                        key={label}
                        label={label}
                        selected={selectedCategory === label}
                        onChange={() => handleCategorySelect(label)}
                    />
                ))}
            </FilterGroup>
        </div>
    );
}