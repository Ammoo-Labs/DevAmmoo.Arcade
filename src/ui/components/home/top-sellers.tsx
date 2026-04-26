"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sellers = [
  { id: 1, name: "Urban Style Co.", category: "Fashion", rating: 4.9, sales: "2.1K" },
  { id: 2, name: "TimeKeeper", category: "Accessories", rating: 4.8, sales: "1.8K" },
  { id: 3, name: "Artisan Jewelry", category: "Jewelry", rating: 4.9, sales: "3.2K" },
  { id: 4, name: "Street Vibe", category: "Streetwear", rating: 4.7, sales: "1.5K" },
  { id: 5, name: "Home Harmony", category: "Home Decor", rating: 4.8, sales: "2.4K" },
  { id: 6, name: "Kick Culture", category: "Footwear", rating: 4.9, sales: "2.9K" },
  { id: 7, name: "Craft Corner", category: "Handmade", rating: 4.6, sales: "1.1K" },
  { id: 8, name: "Luxury Silk Co.", category: "Fashion", rating: 4.8, sales: "1.7K" },
];

const extended = [...sellers, ...sellers, ...sellers];

export default function TopSellers() {
  const [currentIndex, setCurrentIndex] = useState(sellers.length);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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

  useEffect(() => {
    if (!isTransitioning) return;
    const t = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentIndex((prev) => {
        if (prev >= sellers.length * 2) return sellers.length;
        if (prev <= 0) return sellers.length;
        return prev;
      });
    }, 500);
    return () => clearTimeout(t);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <section className="py-5 sm:py-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Top Sellers</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous sellers"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next sellers"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          <div className="overflow-hidden mx-10">
            <div
              className="flex"
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
              }}
            >
              {extended.map((seller, index) => (
                <div
                  key={`${seller.id}-${index}`}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="flex flex-col items-center text-center cursor-pointer group py-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-700 via-gray-800 to-black text-white flex items-center justify-center font-bold text-sm mb-1.5 ring-2 ring-transparent group-hover:ring-black transition-all duration-200">
                      {seller.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <p className="text-xs font-semibold text-gray-900 truncate w-full">{seller.name}</p>
                    <p className="text-xs text-gray-400 hidden sm:block truncate w-full">{seller.category}</p>
                    <p className="text-xs font-medium text-black">★ {seller.rating}</p>
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
