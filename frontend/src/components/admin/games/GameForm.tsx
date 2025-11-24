"use client";

import { useEffect, useState } from "react";
import { Game } from "@/lib/types/game";
import ImageUploader from "./ImageUploader";
import RequiredFieldsBuilder from "./RequiredFieldsBuilder";
import StatusToggle from "./StatusToggle";

interface Props {
    gameId: string | "new";
}

export default function GameForm({ gameId }: Props) {
    const isEdit = gameId !== "new";

    const [form, setForm] = useState<Game>({
        name: "",
        slug: "",
        description: "",
        imageUrl: null,
        status: "active",
        requiredFields: [],
    });

    const [file, setFile] = useState<File | null>(null);

    // Load game when editing
    useEffect(() => {
        if (isEdit) {
            fetch(`/api/games/${gameId}`)
                .then((res) => res.json())
                .then((data) => setForm(data));
        }
    }, [isEdit, gameId]);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">
                {isEdit ? "Update Game" : "Create Game"}
            </h1>

            {/* IMAGE */}
            <ImageUploader
                imageUrl={form.imageUrl || null}
                onChange={(file, preview) => {
                    setFile(file);
                    setForm({ ...form, imageUrl: preview });
                }}
            />

            {/* Name */}
            <div>
                <label className="font-medium">Game Name</label>
                <input
                    className="border p-2 rounded w-full"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
            </div>

            {/* Slug */}
            <div>
                <label className="font-medium">Slug</label>
                <input
                    className="border p-2 rounded w-full"
                    value={form.slug}
                    onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                    }
                />
            </div>

            {/* Description */}
            <div>
                <label className="font-medium">Description</label>
                <textarea
                    className="border p-2 rounded w-full"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>

            {/* Status */}
            <div>
                <label className="font-medium">Status</label>
                <StatusToggle
                    value={form.status}
                    onChange={(status) => setForm({ ...form, status })}
                />
            </div>

            {/* Required Fields */}
            <RequiredFieldsBuilder
                fields={form.requiredFields}
                onChange={(fields) =>
                    setForm({ ...form, requiredFields: fields })
                }
            />

            <button className="px-5 py-3 bg-black text-white rounded-lg text-sm">
                {isEdit ? "Update Game" : "Create Game"}
            </button>
        </div>
    );
}