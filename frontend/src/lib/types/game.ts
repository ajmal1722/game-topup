export interface RequiredField {
    fieldName: string;
    fieldKey: string;
    fieldType: "text" | "number" | "email" | "dropdown";
    placeholder?: string;
    options?: string[];
    required: boolean;
}

export interface Game {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    imageUrl?: string | null;
    status: "active" | "inactive";
    requiredFields: RequiredField[];
}
