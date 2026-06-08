"use client";

import { useState, useEffect } from "react";
import {
  ShopFooter,
  ShopHeader,
  ShopCategoryNav,
  ShippingInfo,
  ReturnsExchanges,
} from "@/ui/components/shop";
import { shopClasses } from "@/ui/components/shop/shop-colors";
import Button from "@/ui/components/button/button";
import { ProductCard, Product } from "@/ui/components/product";
import { sampleProducts } from "@/ui/components/product/sample-data";
import {
  getSellerProducts,
  getSellerProfile,
  getSellerAccountStatus,
} from "@/ui/components/seller-dashboard/seller-store";
import { users } from "@/data/users";
import Link from "next/link";

// Map a SellerProduct to the ProductCard Product interface
function toProductCardItem(sp: ReturnType<typeof getSellerProducts>[number], shopName: string): Product {
  return {
    id: sp.id,
    name: sp.name,
    creator: shopName,
    price: sp.price,
    originalPrice: sp.originalPrice ?? null,
    rating: 4.5,
    reviews: sp.sales,
    image: sp.image || `https://picsum.photos/seed/sp-${sp.id}-front/300/400`,
    image2: `https://picsum.photos/seed/sp-${sp.id}-back/300/400`,
    category: sp.category,
    description: sp.description,
    isNew: false,
    isLiked: false,
    inStock: sp.stock > 0,
    store: shopName,
    tags: sp.tags,
  };
}

// Hard-coded demo shop data — fallback if no localStorage profile exists
const HARDCODED_SHOPS: Record<string, {
  id: string; name: string; description: string;
  logo: string; banner: string; categories: string[];
  stats: { products: number; followers: number; rating: number };
}> = {
  "ammoo-arcade": {
    id: "ammoo-arcade",
    name: "Ammoo Arcade",
    description: "Your premier destination for gaming merchandise and collectibles",
    logo: "/images/shop-logo.png",
    banner: "/images/shop-banner.jpg",
    categories: ["Men", "Women", "Unisex", "Gaming", "Tech"],
    stats: { products: 150, followers: 2500, rating: 4.8 },
  },
  "tech-haven": {
    id: "tech-haven",
    name: "Tech Haven",
    description: "Latest technology gadgets and accessories for tech enthusiasts",
    logo: "/images/tech-haven-logo.png",
    banner: "/images/tech-haven-banner.jpg",
    categories: ["Men", "Women", "Unisex", "Electronics", "Accessories"],
    stats: { products: 89, followers: 1800, rating: 4.6 },
  },
  "sarahs-boutique": {
    id: "sarahs-boutique",
    name: "Sarah's Boutique",
    description: "Premium fashion items handpicked for style-conscious customers.",
    logo: "/images/boutique-logo.png",
    banner: "/images/boutique-banner.jpg",
    categories: ["Women", "Accessories", "Jewelry"],
    stats: { products: 64, followers: 1200, rating: 4.9 },
  },
};

// Hard-coded shopId → sellerId mapping for demo shops
const HARDCODED_SELLER_MAP: Record<string, string> = {
  "sarahs-boutique": "seller-sarah",
};

// Compute a slug from a shop name (same algo as product-card.tsx)
function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Build shop data dynamically from users + seller profiles stored in localStorage
function getDynamicShopData(shopId: string) {
  // Check if this ID matches any user's userId directly
  const userById = users.find((u) => u.id === shopId && u.role === "seller");
  if (userById) {
    const profile = getSellerProfile(shopId);
    return {
      id: shopId,
      name: profile.shopName ?? userById.shopName ?? userById.name,
      description: profile.shopDescription ?? userById.shopDescription ?? "",
      logo: profile.profileImage ?? "",
      banner: profile.bannerImage ?? "",
      categories: ["All"],
      stats: { products: 0, followers: 0, rating: 4.0 },
      sellerId: shopId,
    };
  }

  // Check if this slug matches a user's shop name
  const userBySlug = users.find(
    (u) => u.role === "seller" && toSlug(u.shopName ?? "") === shopId
  );
  if (userBySlug) {
    const profile = getSellerProfile(userBySlug.id);
    return {
      id: shopId,
      name: profile.shopName ?? userBySlug.shopName ?? userBySlug.name,
      description: profile.shopDescription ?? userBySlug.shopDescription ?? "",
      logo: profile.profileImage ?? "",
      banner: profile.bannerImage ?? "",
      categories: ["All"],
      stats: { products: 0, followers: 0, rating: 4.0 },
      sellerId: userBySlug.id,
    };
  }

  return null;
}

function getShopProducts(shopId: string, sellerId: string, shopName: string): Product[] {
  const sellerProducts = getSellerProducts(sellerId).filter(
    (p) => p.status === "active" && p.approvalStatus === "approved"
  );
  if (sellerProducts.length > 0) {
    return sellerProducts.map((sp) => toProductCardItem(sp, shopName));
  }
  return sampleProducts.slice(0, 8);
}

export default function ShopClient({ shopId }: { shopId: string }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [shopData, setShopData] = useState<{
    id: string; name: string; description: string;
    logo: string; banner: string; categories: string[];
    stats: { products: number; followers: number; rating: number };
    sellerId?: string;
  } | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentSection, setCurrentSection] = useState<"home" | "shipping" | "returns">("home");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 300));

      // 1. Try hardcoded shop
      const hardcoded = HARDCODED_SHOPS[shopId];
      if (hardcoded) {
        const sellerId = HARDCODED_SELLER_MAP[shopId];
        if (sellerId) {
          const status = getSellerAccountStatus(sellerId);
          if (status !== "active") {
            setIsSuspended(true);
            setIsLoading(false);
            return;
          }
        }
        const products = sellerId
          ? getShopProducts(shopId, sellerId, hardcoded.name)
          : sampleProducts.slice(0, 8);
        setShopData({ ...hardcoded, sellerId });
        setAllProducts(products);
        setFilteredProducts(products);
        setIsLoading(false);
        return;
      }

      // 2. Try dynamic seller lookup
      const dynamic = getDynamicShopData(shopId);
      if (dynamic) {
        const status = getSellerAccountStatus(dynamic.sellerId);
        if (status !== "active") {
          setIsSuspended(true);
          setIsLoading(false);
          return;
        }
        const products = getShopProducts(shopId, dynamic.sellerId, dynamic.name);
        setShopData(dynamic);
        setAllProducts(products);
        setFilteredProducts(products);
        setIsLoading(false);
        return;
      }

      setNotFound(true);
      setIsLoading(false);
    };

    if (shopId) load();
  }, [shopId]);

  useEffect(() => {
    if (!shopData || allProducts.length === 0) return;
    const main = ["Men", "Women", "Unisex"];
    if (selectedCategory === "All") setFilteredProducts(allProducts);
    else if (selectedCategory === "Other")
      setFilteredProducts(allProducts.filter((p) => !main.includes(p.category)));
    else setFilteredProducts(allProducts.filter((p) => p.category === selectedCategory));
  }, [selectedCategory, shopData, allProducts]);

  if (isLoading) {
    return (
      <div className={`min-h-screen ${shopClasses.bg.secondary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto" />
          <p className={`mt-4 ${shopClasses.text.muted}`}>Loading shop...</p>
        </div>
      </div>
    );
  }

  if (isSuspended) {
    return (
      <div className={`min-h-screen ${shopClasses.bg.secondary} flex items-center justify-center`}>
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Unavailable</h1>
          <p className="text-gray-500 mb-6">This shop is currently under review or suspended. Please check back later.</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={`min-h-screen ${shopClasses.bg.secondary} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-4xl font-bold ${shopClasses.text.primary} mb-4`}>Shop Not Found</h1>
          <p className={`${shopClasses.text.muted} mb-8`}>The shop you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/">
            <Button variant="primary" size="lg">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${shopClasses.bg.secondary}`}>
      <ShopHeader
        shopName={shopData?.name ?? ""}
        shopId={shopId}
        onNavigate={(s) => setCurrentSection(s as "home" | "shipping" | "returns")}
      />

      <div className="relative w-11/12 mx-auto bg-white border rounded-lg shadow-sm overflow-hidden mt-12 mb-12">
        <div className="relative w-full h-96 md:h-[28rem]">
          <img
            src={shopData!.banner}
            alt={`${shopData!.name} Banner`}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = "https://cdn.europosters.eu/image/hp/60699.jpg";
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pb-6">
          <div className="absolute -top-40 -left-16 w-80 h-80 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
            <img
              src={shopData!.logo}
              alt={shopData!.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://i.pinimg.com/474x/c3/c2/05/c3c20561f69db03c456a68ab0b4fc33c.jpg";
              }}
            />
          </div>

          <div className="pt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="pl-0 md:pl-96">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-md">
                {shopData!.name}
              </h1>
              <p className="text-gray-700 text-base md:text-lg mt-2 leading-relaxed">
                {shopData!.description}
              </p>
              <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Sri Lanka
              </p>
            </div>

            <div className="flex gap-3 self-start md:self-center mt-4 md:mt-0">
              <Button
                variant={isFollowing ? "primary" : "outline"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following ✓" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentSection === "home" && (
        <>
          <ShopCategoryNav
            categories={shopData?.categories || []}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="max-w-7xl mx-auto px-4 py-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className={`${shopClasses.text.muted} text-lg`}>
                  No products found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(id) => console.log("Add to cart:", id)}
                    onLike={(id) => console.log("Like:", id)}
                    showQuickActions={true}
                    size="md"
                    variant="default"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {currentSection === "shipping" && <ShippingInfo />}
      {currentSection === "returns" && <ReturnsExchanges />}

      <ShopFooter />
    </div>
  );
}
