"use client";
import Link from 'next/link';
import { Button } from '@/ui/components/button';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: 'dashboard' | 'users' | 'sellers' | 'customize') => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
    },
    {
      id: 'users',
      label: 'User Management',
    },
    {
      id: 'sellers',
      label: 'Seller Management',
    },
    {
      id: 'customize',
      label: 'Customize Website',
    }
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg border-r border-gray-200">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-black">Ammoo Arcade</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/">
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            className="justify-center"
          >
            ← Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );
}