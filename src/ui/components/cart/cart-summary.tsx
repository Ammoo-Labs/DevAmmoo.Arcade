"use client";

import { CartSummary } from "./types";
import { ActionButton } from "@/ui/components/button";
import { ShoppingBag, CreditCard } from "lucide-react";

interface CartSummaryProps {
  summary: CartSummary;
  itemCount: number;
  selectedCount: number;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function CartSummaryCard({
  summary,
  itemCount,
  selectedCount,
  onCheckout,
  onContinueShopping,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Items ({selectedCount} of {itemCount} selected)
          </span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>
            {summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>${summary.tax.toFixed(2)}</span>
        </div>

        {/* Savings */}
        {summary.savings && summary.savings > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>You Save</span>
            <span>-${summary.savings.toFixed(2)}</span>
          </div>
        )}

        <hr className="border-gray-200" />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {summary.shipping === 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 You qualify for free shipping!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mt-6">
        <ActionButton
          onClick={onCheckout}
          size="lg"
          className="w-full"
          disabled={selectedCount === 0}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {selectedCount === 0 ? "Select items to checkout" : `Checkout ${selectedCount} item${selectedCount !== 1 ? "s" : ""}`}
        </ActionButton>
        
        <ActionButton
          onClick={onContinueShopping}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </ActionButton>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🔒 Secure checkout with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}