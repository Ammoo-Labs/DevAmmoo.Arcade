"use client";
import { useState } from "react";
import { Store } from "lucide-react";
import { ShopWizardData } from "./shop-wizard";
import { useNotifications } from "@/ui/components/notifications";
import InlineNotification from "@/ui/components/notifications/inline-notification";

interface ShopNameStepProps {
  data: ShopWizardData;
  updateData: (data: Partial<ShopWizardData>) => void;
  onNext: () => void;
}

export default function ShopNameStep({ data, updateData, onNext }: ShopNameStepProps) {
  const [shopName, setShopName] = useState(data.shopName);
  const [error, setError] = useState("");
  const { showSuccess, showWarning } = useNotifications();

  const handleNext = () => {
    if (!shopName.trim()) {
      setError("Shop name is required");
      return;
    }
    if (shopName.trim().length < 3) {
      setError("Shop name must be at least 3 characters long");
      return;
    }
    if (shopName.trim().length > 50) {
      setError("Shop name must be less than 50 characters");
      return;
    }
    
    // Check for inappropriate characters
    const invalidChars = /[<>"'&]/;
    if (invalidChars.test(shopName)) {
      setError("Shop name contains invalid characters");
      return;
    }
    
    updateData({ shopName: shopName.trim() });
    onNext();
  };

  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShopName(value);
    setError("");
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-black mb-4 sm:mb-6">
          <Store className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Your Shop</h2>
        <p className="mt-2 text-sm text-gray-600">
          Let's start by giving your shop a name that represents your brand
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
            Shop Name *
          </label>
          <input
            type="text"
            id="shopName"
            value={shopName}
            onChange={handleShopNameChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your shop name (e.g., John's Electronics)"
            maxLength={50}
          />
          {error && (
            <div className="mt-2">
              <InlineNotification type="error" message={error} />
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {shopName.length}/50 characters
            </p>
            {shopName.length >= 45 && (
              <p className="text-sm text-yellow-600">
                Character limit approaching
              </p>
            )}
          </div>
        </div>


        <button
          onClick={handleNext}
          disabled={!shopName.trim()}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}