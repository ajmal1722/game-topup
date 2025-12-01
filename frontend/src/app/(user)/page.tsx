import HeroCarousel from "@/components/user/homePage/HeroCarousel";
import HotProducts from "@/components/user/homePage/HotProducts";
import { Game } from "@/lib/types/game";

export default async function Page() {
    // Here you will fetch real games from DB or API
    const games: Game[] = [
        {
            _id: "1",
            name: "PUBG",
            slug: "pubg",
            imageUrl: "/images/pubg.jpg",
            description: "Battle Royale Legend",
            requiredFields: [],
            status: "active",
        },
        {
            _id: "2",
            name: "Free Fire",
            slug: "free-fire",
            imageUrl: "/images/freefire.jpg",
            description: "Fast-paced Action",
            requiredFields: [],
            status: "active",
        },
        {
            _id: "3",
            name: "FIFA 24",
            slug: "fifa-24",
            imageUrl: "/images/fifa.jpg",
            description: "Football Simulation",
            requiredFields: [],
            status: "active",
        }
    ];

    return (
        <div className="bg-linear-to-b from-primary to-primary/90">
            <HeroCarousel games={games} />
            <HotProducts games={games} />
        </div>
    );
}
