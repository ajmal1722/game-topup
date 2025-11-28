'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductToolbar from './ProductToolbar';
import SearchBox from '../shared/SearchBox';

import { Product } from '@/lib/types/product';
import ProductTable from "./ProductTable";

const AdminProductListing = ({ products }: { products: Product[]}) => {
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

            />
        </div>
    )
}

export default AdminProductListing;