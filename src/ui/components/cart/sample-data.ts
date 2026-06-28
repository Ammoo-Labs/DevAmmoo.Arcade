import { CartItem } from "./types";

export const sampleCartItems: CartItem[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    productId: "00000000-0000-0000-0000-000000000101",
    name: "Vintage Leather Jacket",
    creator: "John Smith",
    price: 129.99,
    originalPrice: 179.99,
    image: "https://picsum.photos/seed/cart-item/300/400",
    quantity: 1,
    size: "M",
    color: "Brown",
    store: "Fashion Forward",
    inStock: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    productId: "00000000-0000-0000-0000-000000000103",
    name: "Handcrafted Silver Ring",
    creator: "Alice Johnson",
    price: 89.99,
    originalPrice: null,
    image: "https://picsum.photos/seed/cart-item/300/400",
    quantity: 2,
    size: "7",
    store: "Jewelry Plus",
    inStock: true,
  },
];
