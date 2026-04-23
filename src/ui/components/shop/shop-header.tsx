"use client";

import { useState } from 'react';
import Link from 'next/link';
import { shopClasses } from './shop-colors';

interface ShopHeaderProps {
  shopName: string;
  shopId?: string;
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

export function ShopHeader({ shopName, shopId, onNavigate }: ShopHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shipping', label: 'Shipping Info' },
    { id: 'returns', label: 'Returns & Exchanges' },
  ];

  return (
    <>
      {/* Shop Header */}
      <header className={`${shopClasses.bg.primary} border-b sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Shop Name */}
            <div className="flex items-center space-x-3">
              {shopId ? (
                <Link href={`/shop/${shopId}`}>
                  <h1 className={`text-xl font-bold ${shopClasses.text.primary} cursor-pointer`}>
                    {shopName || 'Shop'}
                  </h1>
                </Link>
              ) : (
                <h1 className={`text-xl font-bold ${shopClasses.text.primary}`}>
                  {shopName || 'Shop'}
                </h1>
              )}
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className="font-medium py-2 text-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${shopClasses.bg.primary}`}>
            <nav className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-medium py-2 text-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
