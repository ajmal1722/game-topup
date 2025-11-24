"use client";

import { RequiredField } from "@/lib/types/game";
import { IoTrash } from "react-icons/io5";

interface Props {
    fields: RequiredField[];
    onChange: (fields: RequiredField[]) => void;
}

export default function RequiredFieldsBuilder({ fields, onChange }: Props) {
    const addField = () => {
        onChange([
            ...fields,
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

    const updateField = (index: number, value: Partial<RequiredField>) => {
        const updated = [...fields];
        updated[index] = { ...updated[index], ...value };
        onChange(updated);
    };

    const removeField = (index: number) => {
        onChange(fields.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <label className="text-lg font-semibold mr-2">Required Fields</label>

            {fields.map((field, i) => (
                <div key={i} className="p-4 border rounded-xl bg-gray-50">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <input
                            className="border p-2 rounded"
                            placeholder="Field Name"
                            value={field.fieldName}
                            onChange={(e) =>
                                updateField(i, { fieldName: e.target.value })
                            }
                        />

                        <input
                            className="border p-2 rounded"
                            placeholder="field_key"
                            value={field.fieldKey}
                            onChange={(e) =>
                                updateField(i, { fieldKey: e.target.value })
                            }
                        />
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <select
                            className="border p-2 rounded"
                            value={field.fieldType}
                            onChange={(e) =>
                                updateField(i, {
                                    fieldType: e.target.value as RequiredField["fieldType"],
                                })
                            }
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="dropdown">Dropdown</option>
                        </select>

                        <input
                            className="border p-2 rounded"
                            placeholder="Placeholder"
                            value={field.placeholder}
                            onChange={(e) =>
                                updateField(i, { placeholder: e.target.value })
                            }
                        />
                    </div>

                    {/* Dropdown options */}
                    {field.fieldType === "dropdown" && (
                        <textarea
                            className="border p-2 rounded w-full mb-3"
                            rows={2}
                            placeholder="Enter options separated by commas"
                            value={field.options?.join(", ") ?? ""}
                            onChange={(e) =>
                                updateField(i, {
                                    options: e.target.value.split(",").map((o) => o.trim()),
                                })
                            }
                        />
                    )}

                    <button
                        className="text-red-600 flex items-center gap-1"
                        onClick={() => removeField(i)}
                    >
                        <IoTrash /> Remove
                    </button>
                </div>
            ))}

            <button
                onClick={addField}
                className="px-4 py-2 bg-black text-white rounded-lg"
            >
                + Add Field
            </button>
        </div>
    );
}