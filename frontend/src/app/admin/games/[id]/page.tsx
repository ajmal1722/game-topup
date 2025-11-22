"use client";

import { useState } from "react";
import StatusToggle from "@/components/admin/games/StatusToggle";

const fieldTypes = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Email", value: "email" },
    { label: "Dropdown", value: "dropdown" },
];

export default function CreateGame() {
    const [gameData, setGameData] = useState({
        name: "",
        slug: "",
        description: "",
        status: "active",
    });

    const [image, setImage] = useState(null);
    const [requiredFields, setRequiredFields] = useState([]);

    const handleAddField = () => {
        setRequiredFields([
            ...requiredFields,
            {
                fieldName: "",
                fieldKey: "",
                fieldType: "text",
                placeholder: "",
                options: [],
                required: true,
            },
        ]);
    };

    const handleFieldChange = (index, key, value) => {
        const fields = [...requiredFields];
        fields[index][key] = value;
        setRequiredFields(fields);
    };

    const handleRemoveField = (index) => {
        setRequiredFields(requiredFields.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 lg:p-10">
            <h1 className="text-3xl font-semibold mb-6">Create New Game</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">
                {/* Left Section */}
                <div className="flex flex-col gap-5">
                    {/* Game Name */}
                    <div>
                        <label className="font-medium">Game Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border p-3 bg-gray-50"
                            value={gameData.name}
                            onChange={(e) =>
                                setGameData({ ...gameData, name: e.target.value })
                            }
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="font-medium">Slug</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border p-3 bg-gray-50"
                            value={gameData.slug}
                            onChange={(e) =>
                                setGameData({ ...gameData, slug: e.target.value })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="font-medium">Description</label>
                        <textarea
                            rows="4"
                            className="mt-1 w-full rounded-lg border p-3 bg-gray-50"
                            value={gameData.description}
                            onChange={(e) =>
                                setGameData({ ...gameData, description: e.target.value })
                            }
                        ></textarea>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <label className="font-medium">Status</label>
                        <StatusToggle
                            defaultStatus={gameData.status === "active"}
                            onChange={(val) =>
                                setGameData({ ...gameData, status: val ? "active" : "inactive" })
                            }
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-5">
                    {/* Image Upload */}
                    <div>
                        <label className="font-medium">Game Image</label>
                        <div className="mt-2 border-dashed border-2 rounded-xl p-5 flex flex-col items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0])}
                            />

                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover mt-4 rounded"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Required Fields */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Required Fields</h2>
                    <button
                        onClick={handleAddField}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        + Add Field
                    </button>
                </div>

                <div className="space-y-6">
                    {requiredFields.map((field, index) => (
                        <div
                            key={index}
                            className="p-5 border rounded-xl bg-gray-50 relative"
                        >
                            {/* Remove Field */}
                            <button
                                onClick={() => handleRemoveField(index)}
                                className="absolute top-3 right-3 text-red-500 font-bold"
                            >
                                ✕
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Field Name */}
                                <div>
                                    <label className="font-medium">Field Name</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded border p-2"
                                        value={field.fieldName}
                                        onChange={(e) =>
                                            handleFieldChange(index, "fieldName", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Field Key */}
                                <div>
                                    <label className="font-medium">Field Key</label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full rounded border p-2"
                                        value={field.fieldKey}
                                        onChange={(e) =>
                                            handleFieldChange(index, "fieldKey", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Field Type */}
                                <div>
                                    <label className="font-medium">Field Type</label>
                                    <select
                                        className="mt-1 w-full rounded border p-2"
                                        value={field.fieldType}
                                        onChange={(e) =>
                                            handleFieldChange(index, "fieldType", e.target.value)
                                        }
                                    >
                                        {fieldTypes.map((ft) => (
                                            <option key={ft.value} value={ft.value}>
                                                {ft.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Placeholder */}
                            <div className="mt-3">
                                <label className="font-medium">Placeholder</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded border p-2"
                                    value={field.placeholder}
                                    onChange={(e) =>
                                        handleFieldChange(index, "placeholder", e.target.value)
                                    }
                                />
                            </div>

                            {/* Dropdown Options */}
                            {field.fieldType === "dropdown" && (
                                <div className="mt-3">
                                    <label className="font-medium">Dropdown Options</label>
                                    <textarea
                                        rows="3"
                                        className="mt-1 w-full rounded border p-2"
                                        placeholder="Enter options separated by commas"
                                        onChange={(e) =>
                                            handleFieldChange(
                                                index,
                                                "options",
                                                e.target.value.split(",")
                                            )
                                        }
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg shadow">
                    Create Game
                </button>
            </div>
        </div>
    );
}
