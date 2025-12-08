import { gamesApiServer } from "@/services/games";
import { Game } from "@/services/games";
import CategoryListingPage from "@/components/user/categories/CategoryListingPage";

export default async function CategoryPage() {
    const games = await gamesApiServer.list();
    const data: Game[] = games.data || [];

    return <CategoryListingPage games={data} />;
}