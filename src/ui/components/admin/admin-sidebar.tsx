"use client";
import Link from 'next/link';
import { Button } from '@/ui/components/button';

type AdminSection = 'dashboard' | 'users' | 'sellers' | 'posts' | 'orders' | 'customers' | 'customize';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems: { id: AdminSection; label: string }[] = [
    { id: 'dashboard',  label: 'Dashboard Overview' },
    { id: 'sellers',    label: 'Seller Management' },
    { id: 'posts',      label: 'Post Management' },
    { id: 'orders',     label: 'Order Management' },
    { id: 'customers',  label: 'Customer Management' },
    { id: 'users',      label: 'User Management' },
    { id: 'customize',  label: 'Customize Website' },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-black">Ammoo Arcade</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
              activeSection === item.id
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/">
          <Button variant="outline" size="sm" fullWidth className="justify-center">
            ← Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );
}
