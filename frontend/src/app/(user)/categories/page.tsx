import { gamesApiServer } from "@/services/games";
import { Game } from "@/services/games";
import CategoryListingPage from "@/components/user/categories/CategoryListingPage";

export default async function CategoryPage({ searchParams }: { searchParams: any }) {
    // Await searchParams if it's a Promise (Next.js 16 requirement)
    const resolvedParams = typeof searchParams?.then === "function"
        ? await searchParams
        : searchParams;

    // normalize page (handle string | string[] | undefined)
    const rawPage = resolvedParams?.page;
    const parsed = Array.isArray(rawPage) ? rawPage[0] : rawPage;
    const pageNum = Number(parsed);
    const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const limit = 4;

    const res = await gamesApiServer.list({ page, limit });
    // debug: log server-side resolved page
    // eslint-disable-next-line no-console
    console.log("[CategoryPage] server page:", page);

    const games: Game[] = res.data;
    const totalPages: number = res.totalPages;

    return (
        <CategoryListingPage 
            games={games}
            currentPage={page}
            totalPages={totalPages}
        />
    );
}