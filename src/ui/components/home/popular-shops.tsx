"use client";

import { useEffect, useState } from "react";
import { listShops } from "@/lib/api/shops";

export default function PopularShops() {
  const [shops, setShops] = useState<string[]>([]);

  useEffect(() => {
    listShops()
      .then((res) => setShops(res.map((shop) => shop.shopName)))
      .catch(() => setShops([]));
  }, []);

  if (shops.length === 0) return null;

  return (
    <section className="bg-black py-2 overflow-hidden">
      <div className="relative">
        {/* Sliding strip */}
        <div className="flex animate-scroll">
          {/* First set of shops */}
          {shops.map((shop, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-8 py-2"
            >
              <span className="text-white font-medium text-lg whitespace-nowrap">
                {shop}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {shops.map((shop, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 py-2"
            >
              <span className="text-white font-medium text-lg whitespace-nowrap">
                {shop}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}