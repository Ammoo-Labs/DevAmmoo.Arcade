"use client";

import { useRouter } from "next/navigation";
import { Edit, Package, Heart, Settings, CreditCard, Bell, Store } from "lucide-react";

interface QuickActionsProps {
  userRole: "customer" | "seller";
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const router = useRouter();

  const customerActions = [
    { icon: Edit,       label: "Edit Profile",      href: "/profile" },
    { icon: Package,    label: "View Orders",        href: "/profile?tab=orders" },
    { icon: Heart,      label: "Wishlist",           href: "/products" },
    { icon: CreditCard, label: "Payment Methods",    href: "/checkout" },
    { icon: Bell,       label: "Notifications",      href: "/profile?tab=notifications" },
    { icon: Settings,   label: "Account Settings",   href: "/profile?tab=settings" },
  ];

  const sellerActions = [
    { icon: Edit,    label: "Edit Profile",    href: "/seller?tab=profile" },
    { icon: Package, label: "My Products",     href: "/seller?tab=products" },
    { icon: Store,   label: "View Orders",     href: "/seller?tab=orders" },
    { icon: Settings,label: "Shop Settings",   href: "/seller" },
    { icon: Bell,    label: "Notifications",   href: "/seller" },
    { icon: CreditCard,label:"Payouts",        href: "/seller?tab=payouts" },
  ];

  const actions = userRole === "seller" ? sellerActions : customerActions;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 transition-all text-left group"
            >
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
