"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItemCard, CartSummaryCard, CartSummary, useCart } from "@/ui/components/cart";
import { ActionButton } from "@/ui/components/button";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartItemCount } = useCart();

  // Selection state — default all selected
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Sync selectedIds when cartItems change (e.g. item removed, initial load)
  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = new Set(cartItems.map((i) => i.id));
      // Keep existing selections that are still in cart; add new items as selected
      const next = new Set<number>();
      for (const id of currentIds) {
        next.add(prev.has(id) ? id : id); // preserve existing, add new
      }
      // Remove IDs no longer in cart
      for (const id of prev) {
        if (!currentIds.has(id)) next.delete(id);
      }
      // If this is first render (prev empty), select all
      if (prev.size === 0) return currentIds;
      return next;
    });
  }, [cartItems]);

  const toggleItem = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < cartItems.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((i) => i.id)));
    }
  };

  const selectedItems = cartItems.filter((i) => selectedIds.has(i.id));

  // Calculate cart summary for SELECTED items only
  const cartSummary = useMemo((): CartSummary => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalOriginalPrice = selectedItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + originalPrice * item.quantity;
    }, 0);
    const savings = totalOriginalPrice - subtotal;
    const shipping = subtotal > 50 ? 0 : selectedItems.length > 0 ? 9.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      savings: savings > 0 ? savings : undefined,
    };
  }, [selectedItems]);

  const itemCount = getCartItemCount();

  const handleUpdateQuantity = (id: number, quantity: number) => updateQuantity(id, quantity);
  const handleRemoveItem = (id: number) => removeFromCart(id);
  const handleMoveToWishlist = (id: number) => handleRemoveItem(id);

  const handleCheckout = () => {
    // Persist selected IDs so checkout page knows which items to process
    sessionStorage.setItem("ammoo-checkout-selected", JSON.stringify([...selectedIds]));
    router.push("/checkout");
  };

  const handleContinueShopping = () => router.push("/products");
  const handleClearCart = () => clearCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our amazing products!
            </p>
            <ActionButton onClick={handleContinueShopping} size="lg">
              <Package className="w-5 h-5 mr-2" />
              Start Shopping
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-lg text-gray-600">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <ActionButton onClick={() => router.back()} variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </ActionButton>
            {cartItems.length > 0 && (
              <ActionButton
                onClick={handleClearCart}
                variant="secondary"
                size="md"
                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Clear Cart
              </ActionButton>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Select All row */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {allSelected ? "Deselect all" : "Select all"} ({selectedIds.size} of {cartItems.length} selected)
              </span>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onMoveToWishlist={handleMoveToWishlist}
                  isSelected={selectedIds.has(item.id)}
                  onToggle={toggleItem}
                />
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">You might also like</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-600 mb-4">Discover more amazing products</p>
                <Link href="/products">
                  <ActionButton variant="secondary">Browse Products</ActionButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 lg:mt-0">
            <CartSummaryCard
              summary={cartSummary}
              itemCount={itemCount}
              selectedCount={selectedIds.size}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
