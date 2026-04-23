"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  BarChart3,
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut
} from "lucide-react";
import { ActionButton, IconButton } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import { useRouter } from "next/navigation";

// Import components
import EditProfile from "@/ui/components/seller-dashboard/edit-profile/edit-profile";
import ShopOverview from "@/ui/components/seller-dashboard/shop-overview/shop-overview";
import Products from "@/ui/components/seller-dashboard/products/products";
import Orders from "@/ui/components/seller-dashboard/orders/orders";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    id: "overview",
    icon: Home,
    label: "Dashboard",
    description: "Main overview"
  },
  {
    id: "profile",
    icon: User,
    label: "Edit Profile",
    description: "Manage your profile"
  },
  
  {
    id: "products",
    icon: Package,
    label: "Products",
    description: "Manage your products"
  },
  {
    id: "orders",
    icon: ShoppingBag,
    label: "Orders",
    description: "Manage orders"
  }
];

export default function SellerDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <EditProfile />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      default:
        return <ShopOverview />; // Default to overview
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <IconButton
          icon="custom"
          customIcon={isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          onClick={toggleMobileMenu}
          className="bg-white shadow-lg"
        />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-45
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-gray-900">Seller Dashboard</h2>
                <p className="text-sm text-gray-500">Manage your store</p>
              </div>
            )}
            
            {/* Desktop Collapse Button */}
            <div className="hidden lg:block">
              <IconButton
                icon="custom"
                customIcon={isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                onClick={toggleSidebar}
                variant="ghost"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                      ${active 
                        ? "bg-black text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs opacity-75">{item.description}</p>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link href="/">
            <ActionButton
              variant="secondary"
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-2" : "justify-start space-x-2"}`}
            >
              <Home className="w-4 h-4" />
              {!isCollapsed && <span>Back to Shop</span>}
            </ActionButton>
          </Link>
          
          <ActionButton
            onClick={handleLogout}
            variant="secondary"
            className={`w-full flex items-center ${isCollapsed ? "justify-center px-2" : "justify-start space-x-2"} text-red-600 hover:text-red-700 hover:bg-red-50`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </ActionButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-8 pt-32 lg:pt-24">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}