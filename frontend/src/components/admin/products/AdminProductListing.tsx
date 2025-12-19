'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductToolbar from './ProductToolbar';
import SearchBox from '../shared/SearchBox';
import { productsApiClient } from "@/services/products";

import { Product } from '@/lib/types/product';
import ProductTable from "./ProductTable";
import { toast } from "react-toastify";

const AdminProductListing = ({ products }: { products: Product[] }) => {
    const router = useRouter();

    const [items, setItems] = useState(products);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return items;
        return items.filter(i =>
            `${i.name} ${i.slug}`.toLowerCase().includes(q)
        );
    }, [search, items]);

    const handleEdit = (index: number, item: Product) => {
        router.push(`/admin/products/${item._id}`);
    }

    const handleDelete = async (index: number, item: Product) => {
        if (!confirm("Are you sure you want to delete this game?")) return;

        try {
            await productsApiClient.remove(item._id);

            setItems(prev => prev.filter((_, i) => i !== index));
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    }

    // const handleToggle = async (index: number, item: Product) => {
    //     try {
    //         await productsApiClient.toggle(item._id);

    //         setItems(prev => prev.map((i, idx) => idx === index ? { ...i, status: i.status === "active" ? "inactive" : "active" } : i));
    //         toast.success("Product status toggled");
    //     } catch (error) {
    //         toast.error("Failed to toggle product status");
    //     }
    // }

    return (
        <div className='p-6 w-full'>
            <ProductToolbar />

            <SearchBox
                value={search}
                onChange={(val) => setSearch(val)}
                placeholder="Search products..."
            />

            <ProductTable
                items={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default AdminProductListing;