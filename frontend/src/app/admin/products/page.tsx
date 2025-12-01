import AdminProductListing from "@/components/admin/products/AdminProductListing";
import { productsApiServer } from "@/services/products/productsApi.server";

const ProductsPage = async () => {
    const products = await productsApiServer.list(); 
    const data = products.data || [];

    return (
        <div >
            <AdminProductListing products={data} />
        </div>
    )
}

export default ProductsPage;