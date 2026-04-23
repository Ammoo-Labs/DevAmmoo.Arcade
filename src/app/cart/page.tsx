"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartItemCard, CartSummaryCard, CartSummary, useCart } from "@/ui/components/cart";
import { ActionButton } from "@/ui/components/button";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartItemCount } = useCart();

  // Calculate cart summary
  const cartSummary = useMemo((): CartSummary => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalOriginalPrice = cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + (originalPrice * item.quantity);
    }, 0);
    const savings = totalOriginalPrice - subtotal;
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      savings: savings > 0 ? savings : undefined
    };
  }, [cartItems]);

  const itemCount = getCartItemCount();

  // Cart handlers
  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleMoveToWishlist = (id: number) => {
    console.log('Move to wishlist:', id);
    handleRemoveItem(id);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Shopping Cart</span>
          </nav>

          {/* Empty Cart */}
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 sm:mt-0">
            <ActionButton
              onClick={() => router.back()}
              variant="secondary"
              size="md"
            >
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
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onMoveToWishlist={handleMoveToWishlist}
                />
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">You might also like</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-600 mb-4">Discover more amazing products</p>
                <Link href="/products">
                  <ActionButton variant="secondary">
                    Browse Products
                  </ActionButton>
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 lg:mt-0">
            <CartSummaryCard
              summary={cartSummary}
              itemCount={itemCount}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}