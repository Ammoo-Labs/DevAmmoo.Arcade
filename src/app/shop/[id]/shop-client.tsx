"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShopFooter,
  ShopHeader,
  ShopCategoryNav,
  ShippingInfo,
  ReturnsExchanges,
} from "@/ui/components/shop";
import { shopClasses } from "@/ui/components/shop/shop-colors";
import Button from "@/ui/components/button/button";
import { ProductCard, Product, mapBackendProduct } from "@/ui/components/product";
import { getShopBySlug, followShop, unfollowShop, isFollowingShop } from "@/lib/api/shops";
import { BackendShop } from "@/lib/api/types";
import { useAuth } from "@/ui/components/auth/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShopClient({ shopId }: { shopId: string }) {
  const { accessToken, isAuthenticated } = useAuth();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shop, setShop] = useState<BackendShop | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentSection, setCurrentSection] = useState<"home" | "shipping" | "returns">("home");

  const loadShop = useCallback(async () => {
    setIsLoading(true);
    setNotFound(false);
    setIsSuspended(false);
    try {
      const data = await getShopBySlug(shopId);
      if (data.accountStatus !== "active") {
        setIsSuspended(true);
        setIsLoading(false);
        return;
      }
      const products = (data.products ?? []).map(mapBackendProduct);
      setShop(data);
      setAllProducts(products);
      setFilteredProducts(products);
      setCategories(Array.from(new Set(products.map((p) => p.category))));
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    if (shopId) loadShop();
  }, [shopId, loadShop]);

  // Check follow status once we know the shop and the user is signed in
  useEffect(() => {
    if (!shop || !accessToken) {
      setIsFollowing(false);
      return;
    }
    let cancelled = false;
    isFollowingShop(accessToken, shop.id)
      .then((res) => { if (!cancelled) setIsFollowing(res.following); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [shop, accessToken]);

  useEffect(() => {
    if (!shop || allProducts.length === 0) {
      setFilteredProducts(allProducts);
      return;
    }
    const main = ["Men", "Women", "Unisex"];
    if (selectedCategory === "All") setFilteredProducts(allProducts);
    else if (selectedCategory === "Other")
      setFilteredProducts(allProducts.filter((p) => !main.includes(p.category)));
    else setFilteredProducts(allProducts.filter((p) => p.category === selectedCategory));
  }, [selectedCategory, shop, allProducts]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated || !accessToken) {
      router.push("/signin");
      return;
    }
    if (!shop) return;
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      if (next) await followShop(accessToken, shop.id);
      else await unfollowShop(accessToken, shop.id);
    } catch {
      setIsFollowing(!next);
    }
  };

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

  if (notFound || !shop) {
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
        shopName={shop.shopName}
        shopId={shopId}
        onNavigate={(s) => setCurrentSection(s as "home" | "shipping" | "returns")}
      />

      <div className="relative w-11/12 mx-auto bg-white border rounded-lg shadow-sm overflow-hidden mt-12 mb-12">
        <div className="relative w-full h-96 md:h-[28rem]">
          <img
            src={shop.bannerImage || "https://cdn.europosters.eu/image/hp/60699.jpg"}
            alt={`${shop.shopName} Banner`}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = "https://cdn.europosters.eu/image/hp/60699.jpg";
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pb-6">
          <div className="absolute -top-40 -left-16 w-80 h-80 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
            <img
              src={shop.profileImage || "https://i.pinimg.com/474x/c3/c2/05/c3c20561f69db03c456a68ab0b4fc33c.jpg"}
              alt={shop.shopName}
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
                {shop.shopName}
              </h1>
              <p className="text-gray-700 text-base md:text-lg mt-2 leading-relaxed">
                {shop.shopDescription}
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
                onClick={handleToggleFollow}
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
            categories={categories}
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
