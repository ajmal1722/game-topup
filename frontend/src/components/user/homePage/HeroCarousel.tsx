"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Game } from "@/lib/types/game";

export default function HeroCarousel({ games }: { games: Game[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    // Go to slide
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setAutoPlay(false);
    };

    // Autoplay
    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % games.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [autoPlay, games.length]);

    const nextSlide = () => goToSlide((currentIndex + 1) % games.length);
    const prevSlide = () =>
        goToSlide((currentIndex - 1 + games.length) % games.length);

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8  relative overflow-hidden">

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Main carousel */}
                <div className="relative mb-8 lg:mt-8">
                    <div className="relative overflow-hidden rounded-xl">
                        <div className="relative max-h-[80vh] lg:min-h-[60vh] min-h-[30vh]">

                            {games.map((game, index) => (
                                <div
                                    key={game._id}
                                    className={`absolute inset-0 transition-all duration-500 ease-out transform ${
                                        index === currentIndex
                                            ? "opacity-100 scale-100"
                                            : index < currentIndex
                                            ? "opacity-0 scale-95 translate-x-full"
                                            : "opacity-0 scale-95 -translate-x-full"
                                    }`}
                                >
                                    <div
                                        className={`h-full relative overflow-hidden`}
                                    >
                                        {/* Pattern (unchanged) */}
                                        <div className="absolute inset-0 opacity-20">
                                            <div
                                                style={{
                                                    backgroundImage:
                                                        "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                                                    backgroundSize: "50px 50px",
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 text-center backdrop-blur-sm">
                                            
                                            {/* Game Image */}
                                            <img
                                                src={game.imageUrl ?? "/placeholder.png"}
                                                alt={game.name}
                                                className="w-40 h-40 object-cover rounded-xl shadow-xl mb-6 border border-white/20"
                                            />

                                            <h3 className="text-4xl font-black mb-2">
                                                {game.name}
                                            </h3>
                                            <p className="text-lg opacity-90">
                                                {game.description}
                                            </p>
                                        </div>

                                        {/* Neon border effect */}
                                        <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-xl" />
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
                        >
                            <FaChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
                        >
                            <FaChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {games.map((game, index) => (
                            <button
                                key={game._id}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "bg-gradient-neon w-8"
                                        : "bg-gray-600 w-2 hover:bg-gray-500"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                
            </div>
        </section>
    );
}
