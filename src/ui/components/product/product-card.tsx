"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { ActionButton, IconButton } from "@/ui/components/button";
import { ProductCardProps } from "./types";
import { useCart } from "@/ui/components/cart";

export default function ProductCard({
  product,
  onLike,
  onAddToCart,
  isLiked = false,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use cart context to add the product
    addToCart(product);
    // Still call the optional onAddToCart prop for any additional handling
    onAddToCart?.(product.id);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col justify-between mx-auto cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2">
        {/* Product Image */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-gray-100 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2 sm:p-4 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="text-gray-500 text-xs sm:text-sm">Product Image</span>
          )}
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <span className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-black text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
              -{discountPercentage}%
            </span>
          )}
          {/* Like button */}
          <IconButton
            icon="custom"
            customIcon={<Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${isLiked ? "fill-black text-black" : "text-black stroke-2"}`} />}
            onClick={handleLike}
            variant="ghost"
            size="sm"
            isActive={isLiked}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white bg-opacity-90 hover:bg-opacity-100 w-6 h-6 sm:w-8 sm:h-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
          />
        </div>

        {/* Product Info */}
        <div className="p-2 sm:p-4 flex flex-col flex-grow">
          {/* Shop Name */}
          {product.store && (
            <p className="text-xs text-gray-500 mb-1">{product.store}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2 group-hover:text-black transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-1 sm:mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.round(product.rating)
                    ? "fill-black text-black"
                    : "text-gray-400"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-4">
            <span className="font-bold text-sm sm:text-lg text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Different for Mobile and Desktop */}
          <div className="mt-auto">
            {/* Mobile: Cart Icon Only */}
            <div className="block sm:hidden">
              <IconButton
                icon="custom"
                customIcon={<ShoppingCart className="w-4 h-4" />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="primary"
                size="sm"
                className="w-full h-8 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transform transition-all duration-200 hover:scale-105"
                aria-label={product.inStock ? "Add to Cart" : "Out of Stock"}
              />
            </div>
            
            {/* Desktop: Full Button with Text */}
            <div className="hidden sm:block">
              <ActionButton
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="primary"
                size="md"
                className="w-full flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}