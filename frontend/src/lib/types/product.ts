export interface Product {
    _id: string;

    gameId: string;

    name: string;
    slug: string;
    description: string;

    image: string | null;

    price: number;
    discountedPrice: number;

    deliveryTime: string;
    status: "active" | "inactive";
    isPopular: boolean;

    metaTitle: string;
    metaDescription: string;

    createdAt: string;
    updatedAt: string;
}

export interface ProductPayload {
    gameId: string;

    name: string;
    slug: string;

    description?: string;

    image?: string | null;

    price: number;
    discountedPrice: number;

    deliveryTime?: string;
    status?: "active" | "inactive";
    isPopular?: boolean;

    metaTitle?: string;
    metaDescription?: string;
}