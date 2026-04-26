import { Product } from "./types";

// Sample product data for testing and demonstration
export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Leather Jacket",
    creator: "Sarah Johnson",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Fashion",
    description: "Premium quality vintage leather jacket with classic design and modern comfort.",
    isNew: true,
    isLiked: false,
    inStock: true,
    store: "Urban Style Co.",
    tags: ["leather", "vintage", "fashion", "jacket"]
  },
  {
    id: 2,
    name: "Minimalist Watch",
    creator: "Mike Chen",
    price: 159.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Accessories",
    description: "Clean, minimalist design with premium materials and Swiss movement.",
    isNew: false,
    isLiked: true,
    inStock: true,
    store: "TimeKeeper",
    tags: ["watch", "minimalist", "accessories"]
  },
  {
    id: 3,
    name: "Handcrafted Necklace",
    creator: "Emma Davis",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Jewelry",
    description: "Beautiful handcrafted necklace made with precious stones and gold plating.",
    isNew: true,
    isLiked: false,
    inStock: false,
    store: "Artisan Jewelry",
    tags: ["jewelry", "handcrafted", "necklace", "gold"]
  },
  {
    id: 4,
    name: "Streetwear Hoodie",
    creator: "Alex Rodriguez",
    price: 89.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 203,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Fashion",
    description: "Comfortable streetwear hoodie with unique graphics and premium cotton blend.",
    isNew: false,
    isLiked: false,
    inStock: true,
    store: "Street Vibe",
    tags: ["hoodie", "streetwear", "casual", "cotton"]
  },
  {
    id: 5,
    name: "Ceramic Vase Set",
    creator: "Lisa Park",
    price: 129.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviews: 67,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Home Decor",
    description: "Elegant ceramic vase set perfect for modern home decoration.",
    isNew: true,
    isLiked: true,
    inStock: true,
    store: "Home Harmony",
    tags: ["ceramic", "vase", "home-decor", "modern"]
  },
  {
    id: 6,
    name: "Designer Sneakers",
    creator: "David Kim",
    price: 199.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 142,
    image: "/api/placeholder/300/300",
    image2: "/api/placeholder/300/300",
    category: "Footwear",
    description: "Premium designer sneakers with innovative comfort technology.",
    isNew: false,
    isLiked: false,
    inStock: true,
    store: "Kick Culture",
    tags: ["sneakers", "designer", "footwear", "comfort"]
  }
];

// Helper functions for product management
export const getProductsByCategory = (category: string, products: Product[] = sampleProducts): Product[] => {
  if (category === "All") return products;
  return products.filter(product => product.category === category);
};

export const getProductsByStore = (store: string, products: Product[] = sampleProducts): Product[] => {
  return products.filter(product => product.store === store);
};

export const getNewProducts = (products: Product[] = sampleProducts): Product[] => {
  return products.filter(product => product.isNew);
};

export const getSaleProducts = (products: Product[] = sampleProducts): Product[] => {
  return products.filter(product => product.originalPrice && product.originalPrice > product.price);
};

export const getTopRatedProducts = (products: Product[] = sampleProducts): Product[] => {
  return products.filter(product => product.rating >= 4.8);
};

export const searchProducts = (query: string, products: Product[] = sampleProducts): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.creator.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.store?.toLowerCase().includes(lowercaseQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};