"use client";
import { useState } from "react";
import Link from "next/link";
import { ActionButton } from "@/ui/components/button";
import { ProductCard } from "@/ui/components/product";
import { sampleProducts } from "@/ui/components/product/sample-data";

const categories = ["All", "Fashion", "Accessories", "Jewelry", "Home Decor", "Footwear"];

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>(
    sampleProducts.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.isLiked || false }),
      {} as Record<number, boolean>
    )
  );

  const handleLike = (productId: number) => {
    setLikedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = (productId: number) => {
    console.log("Added to cart:", productId);
  };

  const filteredProducts = sampleProducts.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular products from our talented creators
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedProducts[product.id]}
              onLike={handleLike}
              onAddToCart={handleAddToCart}
              showQuickActions={true}
              showStore={false}
              size="md"
              variant="default"
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products in this category</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="text-black hover:underline font-medium"
            >
              View all products
            </button>
          </div>
        )}

        {/* View More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href={
                selectedCategory === "All"
                  ? "/products"
                  : `/products?category=${encodeURIComponent(selectedCategory)}`
              }
            >
              <ActionButton size="lg">
                {selectedCategory === "All" ? "View All Products" : `More ${selectedCategory}`}
              </ActionButton>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
