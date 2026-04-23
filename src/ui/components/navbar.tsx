"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

const navItems = [
  { name: "Mens", dropdown: ["T-Shirts", "Jeans", "Jackets", "Shirts", "Shorts"] },
  { name: "Womens", dropdown: ["Dresses", "Tops", "Jeans", "Skirts", "Blouses"] },
  { name: "Accessories", dropdown: ["Watches", "Bags", "Belts", "Sunglasses", "Jewelry"] },
  { name: "Footwear", dropdown: ["Sneakers", "Boots", "Sandals", "Formal Shoes", "Athletic"] },
  { name: "Sale", dropdown: ["Men's Sale", "Women's Sale", "Accessories Sale", "Clearance"] },
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileDropdown = (itemName: string) => {
    setMobileActiveDropdown(mobileActiveDropdown === itemName ? null : itemName);
  };

  return (
    <nav className="fixed top-[56px] sm:top-[64px] lg:top-[80px] left-0 right-0 z-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex gap-4 lg:gap-12 h-12 justify-center">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-3 text-base font-medium hover:text-gray-600 transition-colors px-2 py-1 h-12">
                  {item.name}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                      {item.dropdown.map((subItem) => (
                        <li key={subItem}>
                          <Link
                            href={`/products?category=${encodeURIComponent(subItem)}`}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation - scrollable toggle */}
        <div className="md:hidden">
          <button
            className="w-full flex items-center justify-between px-2 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            <span>Browse Categories</span>
            {isMobileNavOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isMobileNavOpen && (
            <div className="border-t border-gray-200 max-h-72 overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
                    onClick={() => toggleMobileDropdown(item.name)}
                  >
                    {item.name}
                    {mobileActiveDropdown === item.name ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {mobileActiveDropdown === item.name && (
                    <div className="bg-gray-50">
                      <ul className="py-1">
                        {item.dropdown.map((subItem) => (
                          <li key={subItem}>
                            <Link
                              href={`/products?category=${encodeURIComponent(subItem)}`}
                              className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              {subItem}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
