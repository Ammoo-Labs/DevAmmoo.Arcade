"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const creators = [
  { id: 1, name: "Sarah Johnson", category: "Fashion Designer", rating: 4.9, followers: "12.5K" },
  { id: 2, name: "Mike Chen", category: "Tech Accessories", rating: 4.8, followers: "8.2K" },
  { id: 3, name: "Emma Davis", category: "Jewelry Designer", rating: 4.9, followers: "15.3K" },
  { id: 4, name: "Alex Rodriguez", category: "Streetwear", rating: 4.7, followers: "9.8K" },
  { id: 5, name: "Lisa Park", category: "Home Decor", rating: 4.8, followers: "11.1K" },
  { id: 6, name: "David Kim", category: "Footwear", rating: 4.9, followers: "13.7K" },
  { id: 7, name: "Maria Garcia", category: "Accessories", rating: 4.6, followers: "7.9K" },
  { id: 8, name: "James Wilson", category: "Bags & Luggage", rating: 4.8, followers: "10.4K" },
];

// Triple the array for seamless infinite loop
const extendedCreators = [...creators, ...creators, ...creators];

export default function Creators() {
  const [currentIndex, setCurrentIndex] = useState(creators.length);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
        if (prev >= creators.length * 2) return creators.length;
        if (prev <= 0) return creators.length;
        return prev;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isTransitioning, currentIndex]);

  // Auto-slide with proper cleanup
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

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
                  <div className="text-center cursor-pointer group">
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
