"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/ui/components/product";
import { allProducts } from "@/ui/components/product/all-products";
import { PRODUCT_FILTER_CATEGORIES as categories } from "@/ui/components/product/categories";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>(
    allProducts.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.isLiked || false }),
      {} as Record<number, boolean>
    )
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  // Sync URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleLike = (productId: number) => {
    setLikedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.creator.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.store?.toLowerCase().includes(q) ||
        product.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const clearAll = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSortBy("default");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "All" || sortBy !== "default";

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
              All Products
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Discover amazing products from talented creators around the world
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[56px] sm:top-[64px] lg:top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-black rounded-full" />
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Category pills */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="px-3 py-1 rounded-full text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pt-4">
        <p className="text-sm text-gray-500">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          {searchTerm && <> for &ldquo;<strong>{searchTerm}</strong>&rdquo;</>}
          {selectedCategory !== "All" && <> in <strong>{selectedCategory}</strong></>}
        </p>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <button
                onClick={clearAll}
                className="text-black hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLiked={likedProducts[product.id]}
                  onLike={handleLike}
                  showQuickActions={true}
                  showStore={true}
                  size="md"
                  variant="default"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
