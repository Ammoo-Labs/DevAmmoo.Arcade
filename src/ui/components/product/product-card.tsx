"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { ProductCardProps } from "./types";
import { useCart } from "@/ui/components/cart";
import { useAuth } from "@/ui/components/auth/auth-context";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/api/wishlist";
import { formatLKR } from "./currency";

export default function ProductCard({
  product,
  onLike,
  onAddToCart,
  isLiked,
  showStore = true,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { accessToken, isAuthenticated } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked ?? false);

  useEffect(() => {
    if (isLiked !== undefined) {
      setLiked(isLiked);
      return;
    }
    if (!accessToken) {
      setLiked(false);
      return;
    }
    let cancelled = false;
    isInWishlist(accessToken, product.id)
      .then((res) => { if (!cancelled) setLiked(res.inWishlist); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [accessToken, product.id, isLiked]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !accessToken) {
      router.push("/signin");
      return;
    }
    const next = !liked;
    setLiked(next);
    (next ? addToWishlist(accessToken, product.id) : removeFromWishlist(accessToken, product.id)).catch(() => {
      setLiked(!next);
    });
    onLike?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: [typeof product.image === "string" ? product.image : ""],
      shopName: product.store,
    });
    onAddToCart?.(product.id);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const toSrc = (img: typeof product.image) =>
    typeof img === "string" ? img : img.src;

  const image1Src = toSrc(product.image);
  const image2Src = product.image2 ? toSrc(product.image2) : image1Src;

  return (
    <div
      className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col cursor-pointer group"
      onClick={() => router.push(`/products/${product.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/products/${product.id}`)}
    >
      {/* Product Image — portrait 3:4 */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image
          src={image1Src}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src={image2Src}
          alt={`${product.name} back view`}
          fill
          className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-0.5 rounded z-10">
            -{discountPercentage}%
          </span>
        )}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-black text-black" : "text-gray-700"}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-0.5">
          {product.name}
        </h3>
        {showStore && product.store && (
          <Link
            href={`/shop/${product.storeSlug ?? product.store.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-gray-500 hover:text-black hover:underline transition-colors block mb-1.5 truncate"
          >
            {product.store}
          </Link>
        )}
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-base text-gray-900 leading-tight">
              {formatLKR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through leading-tight">
                {formatLKR(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
