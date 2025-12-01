import ProductForm from '@/components/admin/products/ProductForm';
import React from 'react'

const ProductFormPage = async ({ params }: { params: Promise<{ slug: string }>}) => {
    const { slug } = await params;
    return (
        <ProductForm slug={slug} />
    )
}

export default ProductFormPage;