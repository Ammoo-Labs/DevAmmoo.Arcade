export interface CartItem {
  id: number;
  productId: number;
  name: string;
  creator: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  store: string;
  inStock: boolean;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  savings?: number;
}