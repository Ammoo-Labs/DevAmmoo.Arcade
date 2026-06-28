"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listShops } from "@/lib/api/shops";
import { BackendShop } from "@/lib/api/types";

interface CreatorCard {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  followers: string;
}

function formatFollowers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

function toCreatorCard(shop: BackendShop): CreatorCard {
  return {
    id: shop.id,
    slug: shop.slug,
    name: shop.shopName,
    category: shop.shopDescription ?? "Shop",
    rating: 4.8,
    followers: formatFollowers(shop._count?.followers ?? 0),
  };
}

export default function Creators() {
  const router = useRouter();
  const [creators, setCreators] = useState<CreatorCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    listShops()
      .then((shops) => {
        const cards = shops.map(toCreatorCard);
        setCreators(cards);
        setCurrentIndex(cards.length);
      })
      .catch(() => setCreators([]));
  }, []);

  // Triple the array for seamless infinite loop
  const extendedCreators = creators.length > 0 ? [...creators, ...creators, ...creators] : [];

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning]);

  // Reset to middle set after transition ends to enable infinite loop
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentIndex((prev) => {
        if (creators.length === 0) return prev;
        if (prev >= creators.length * 2) return creators.length;
        if (prev <= 0) return creators.length;
        return prev;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isTransitioning, currentIndex, creators.length]);

  // Auto-slide with proper cleanup
  useEffect(() => {
    if (isPaused || creators.length === 0) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext, creators.length]);

  if (creators.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Featured Creators
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover amazing products from our talented creators and designers
          </p>
        </div>

        {/* Creators Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous creators"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next creators"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          {/* Creators Container */}
          <div className="overflow-hidden mx-12 sm:mx-16 lg:mx-20">
            <div
              className="flex"
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
              }}
            >
              {extendedCreators.map((creator, index) => (
                <div
                  key={`${creator.id}-${index}`}
                  className="flex-shrink-0 px-4 sm:px-6 lg:px-8"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div
                    className="text-center cursor-pointer group"
                    onClick={() => router.push(`/shop/${creator.slug}`)}
                  >
                    {/* Avatar */}
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-black transition-all duration-200">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                          {creator.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold text-black text-sm sm:text-base mb-1 truncate">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1 truncate hidden sm:block">
                      {creator.category}
                    </p>
                    <div className="flex items-center justify-center text-xs sm:text-sm">
                      <span className="text-black font-medium">★ {creator.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
