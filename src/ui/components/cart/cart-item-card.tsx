"use client";

import { useState } from "react";
import Link from "next/link";
import { CartItem } from "./types";
import { ActionButton, IconButton } from "@/ui/components/button";
import { Minus, Plus, Trash2, Heart } from "lucide-react";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onMoveToWishlist?: (id: number) => void;
  isSelected?: boolean;
  onToggle?: (id: number) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  isSelected = true,
  onToggle,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const savings = item.originalPrice ? item.originalPrice - item.price : 0;

  return (
    <div className={`bg-white rounded-lg border p-4 sm:p-6 transition-opacity ${isSelected ? "border-gray-200" : "border-gray-100 opacity-50"}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        {onToggle && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(item.id)}
            className="mt-1.5 w-4 h-4 rounded border-gray-300 accent-black cursor-pointer flex-shrink-0"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Link href={`/products/${item.productId}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
              />
            </Link>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex-1">
                <Link href={`/products/${item.productId}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1">by {item.creator}</p>
                <p className="text-sm text-gray-500 mt-1">Store: {item.store}</p>

                {/* Variants */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {item.size && (
                    <span className="text-sm text-gray-600">
                      Size: <span className="font-medium">{item.size}</span>
                    </span>
                  )}
                  {item.color && (
                    <span className="text-sm text-gray-600">
                      Color: <span className="font-medium">{item.color}</span>
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mt-2">
                  {item.inStock ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col items-start sm:items-end gap-4">
                {/* Price */}
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save ${savings.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <IconButton
                    icon="custom"
                    customIcon={<Minus className="w-4 h-4" />}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  />
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <IconButton
                    icon="custom"
                    customIcon={<Plus className="w-4 h-4" />}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {onMoveToWishlist && (
                    <IconButton
                      icon="custom"
                      customIcon={<Heart className="w-4 h-4" />}
                      size="sm"
                      variant="outline"
                      onClick={() => onMoveToWishlist(item.id)}
                      title="Move to Wishlist"
                    />
                  )}
                  <IconButton
                    icon="custom"
                    customIcon={<Trash2 className="w-4 h-4" />}
                    size="sm"
                    variant="outline"
                    onClick={() => onRemove(item.id)}
                    title="Remove from Cart"
                    className="text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}