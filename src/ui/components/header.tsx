"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "./navbar";
import UserMenu from "./user-menu";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { IconButton } from "@/ui/components/button";
import { useCart } from "@/ui/components/cart";
import { useAuth } from "@/ui/components/auth/auth-context";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartItemCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  const noNavbarPrefixes = [
    "/signin", "/register", "/switch-to-selling", "/forgot-password",
    "/email-verification", "/verify-email", "/cart", "/seller", "/profile",
    "/products/",
  ];
  const shouldShowNavbar = !noNavbarPrefixes.some((p) => pathname === p || pathname.startsWith(p));

  const cartItemCount = getCartItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
      setIsSearchVisible(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(e as unknown as React.FormEvent);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white ${
          shouldShowNavbar ? "" : "border-b shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
          {/* Main header content */}
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Mobile menu button */}
            <IconButton
              icon="custom"
              variant="primary"
              size="md"
              customIcon={
                isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )
              }
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            />

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold hover:text-gray-800 transition-colors cursor-pointer">
                  AMMOO.ARCADE
                </h1>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </form>

            {/* Right side icons */}
            <div className="flex items-center gap-4 sm:gap-2 lg:gap-4">
              {/* Mobile search toggle */}
              <IconButton
                icon="custom"
                variant="ghost"
                size="md"
                customIcon={<Search className="w-5 h-5" />}
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="md:hidden"
              />

              {/* Desktop navigation */}
              <div className="hidden sm:flex items-center gap-2 lg:gap-8">
                <UserMenu buttonText="Welcome" />
                <Link href="/cart" className="relative">
                  <IconButton
                    icon="custom"
                    variant="ghost"
                    size="md"
                    customIcon={<ShoppingBag className="w-5 h-5" />}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated && (
                  <Link href={user?.role === "admin" ? "/admin" : user?.role === "seller" ? "/seller" : "/profile"}>
                    <IconButton
                      icon="custom"
                      variant="ghost"
                      size="md"
                      customIcon={<User className="w-5 h-5" />}
                      title={`${user?.name} (${user?.role})`}
                    />
                  </Link>
                )}
              </div>

              {/* Mobile icons */}
              <div className="flex sm:hidden items-center gap-1">
                <Link href="/cart" className="relative">
                  <IconButton
                    icon="custom"
                    variant="ghost"
                    size="sm"
                    customIcon={<ShoppingBag className="w-4 h-4" />}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </Link>
                {isAuthenticated && (
                  <Link href={user?.role === "admin" ? "/admin" : user?.role === "seller" ? "/seller" : "/profile"}>
                    <IconButton
                      icon="custom"
                      variant="ghost"
                      size="sm"
                      customIcon={<User className="w-4 h-4" />}
                      title={`${user?.name} (${user?.role})`}
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchVisible && (
            <div className="md:hidden py-3 border-t">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <UserMenu buttonText="Welcome" />
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors relative"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-[8px]">
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </span>
                    )}
                  </div>
                  Cart
                </Link>
                {isAuthenticated && (
                  <Link
                    href={user?.role === "admin" ? "/admin" : user?.role === "seller" ? "/seller" : "/profile"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile ({user?.role})
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Bar */}
      {shouldShowNavbar && (
        <div className="border-b shadow-sm">
          <Navbar />
        </div>
      )}
    </>
  );
}
