import { CartItem } from "./types";

export const sampleCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    name: "Vintage Leather Jacket",
    creator: "John Smith",
    price: 129.99,
    originalPrice: 179.99,
    image: "/api/placeholder/300/300",
    quantity: 1,
    size: "M",
    color: "Brown",
    store: "Fashion Forward",
    inStock: true
  },
  {
    id: 2,
    productId: 3,
    name: "Handcrafted Silver Ring",
    creator: "Alice Johnson",
    price: 89.99,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    quantity: 2,
    size: "7",
    store: "Jewelry Plus",
    inStock: true
  },
  {
    id: 3,
    productId: 8,
    name: "Premium Backpack",
    creator: "James Wilson",
    price: 149.99,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    quantity: 1,
    color: "Black",
    store: "Travel Gear Pro",
    inStock: true
  },
  {
    id: 4,
    productId: 11,
    name: "Designer Sunglasses",
    creator: "Elena Fashions",
    price: 179.99,
    originalPrice: 229.99,
    image: "/api/placeholder/300/300",
    quantity: 1,
    store: "Style Studio",
    inStock: false
  }
];