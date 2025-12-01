"use client";

import { Game } from "@/lib/types/game";

interface Props {
    games: Game[];
    goToSlide?: (i: number) => void;
    currentSlide?: number;
}

export default function HotProducts({ games, goToSlide, currentSlide }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {games.map((game, i) => (
                <button
                    key={game._id}
                    // onClick={() => goToSlide(i)}
                    className="group p-4 rounded-lg border-2 border-gray-700 hover:border-secondary bg-slate-800/50 hover:bg-slate-800 transition-all duration-300"
                >
                    <img
                        src={game.imageUrl ?? "/placeholder.png"}
                        className="w-12 h-12 mb-2 object-cover rounded-lg group-hover:scale-110 transition-transform"
                    />
                    <div className="text-sm font-bold text-white">
                        {game.name}
                    </div>
                </button>
            ))}
        </div>
    );
}
