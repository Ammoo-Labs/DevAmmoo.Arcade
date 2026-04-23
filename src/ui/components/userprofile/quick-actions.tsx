"use client";

import { Edit, Package, Heart, Settings, CreditCard, Bell } from "lucide-react";
import { ActionButton } from "@/ui/components/button";

interface QuickActionsProps {
  userRole: "customer" | "seller";
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const customerActions = [
    { icon: Edit, label: "Edit Profile", variant: "secondary" as const },
    { icon: Package, label: "View Orders", variant: "secondary" as const },
    { icon: Heart, label: "Manage Wishlist", variant: "secondary" as const },
    { icon: CreditCard, label: "Payment Methods", variant: "secondary" as const },
    { icon: Bell, label: "Notifications", variant: "secondary" as const },
    { icon: Settings, label: "Account Settings", variant: "secondary" as const }
  ];

  const sellerActions = [
    { icon: Edit, label: "Edit Profile", variant: "secondary" as const },
    { icon: Package, label: "Manage Products", variant: "secondary" as const },
    { icon: Package, label: "View Orders", variant: "secondary" as const },
    { icon: Settings, label: "Shop Settings", variant: "secondary" as const },
    { icon: Bell, label: "Notifications", variant: "secondary" as const },
    { icon: CreditCard, label: "Payment Settings", variant: "secondary" as const }
  ];

  const actions = userRole === "seller" ? sellerActions : customerActions;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <ActionButton 
              key={index} 
              variant={action.variant}
              className="flex items-center justify-center space-x-2 py-3"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </ActionButton>
          );
        })}
      </div>
    </div>
  );
}