"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CartItem } from "./types";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "@/lib/api/cart";
import { BackendCartItem } from "@/lib/api/types";

interface CartContextType {
  cartItems: CartItem[];
  isCartLoading: boolean;
  addToCart: (
    product: { id: string; name: string; price: number; originalPrice?: number | null; images?: string[]; shopName?: string },
    quantity?: number,
    size?: string,
    color?: string,
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function mapBackendItem(item: BackendCartItem): CartItem {
  return {
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    creator: item.product.shop.shopName,
    price: Number(item.product.price),
    originalPrice: item.product.originalPrice != null ? Number(item.product.originalPrice) : null,
    image: item.product.images[0] ?? "",
    quantity: item.quantity,
    size: item.size ?? undefined,
    color: item.color ?? undefined,
    store: item.product.shop.shopName,
    inStock: item.product.stock > 0 && item.product.status === "active",
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!accessToken) {
      setCartItems([]);
      return;
    }
    setIsCartLoading(true);
    try {
      const cart = await getCart(accessToken);
      setCartItems(cart.items.map(mapBackendItem));
    } catch {
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, accessToken, refreshCart]);

  const addToCart = async (
    product: { id: string; name: string; price: number; originalPrice?: number | null; images?: string[]; shopName?: string },
    quantity = 1,
    size?: string,
    color?: string,
  ) => {
    if (!accessToken) return;
    await addCartItem(accessToken, { productId: product.id, quantity, size, color });
    await refreshCart();
  };

  const removeFromCart = async (id: string) => {
    if (!accessToken) return;
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    await removeCartItem(accessToken, id);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!accessToken) return;
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
    await updateCartItem(accessToken, id, quantity);
  };

  const clearCart = async () => {
    if (!accessToken) return;
    setCartItems([]);
    await clearCartApi(accessToken);
  };

  const getCartItemCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemCount,
        getCartTotal,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
