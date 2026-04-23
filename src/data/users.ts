export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller";
  profileImage?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
  // Seller specific fields
  shopName?: string;
  shopDescription?: string;
  // Customer specific fields
  wishlist?: number[];
  followedShops?: string[];
}

// Sample users data
export const users: User[] = [
  {
    id: "user_001",
    name: "John Doe",
    email: "john.customer@example.com",
    password: "password123", // In real app, this would be hashed
    role: "customer",
    profileImage: "/api/placeholder/100/100",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    isVerified: true,
    createdAt: "2024-09-15",
    wishlist: [1, 3, 5],
    followedShops: ["user_002", "shop_003", "shop_004"]
  },
  {
    id: "user_002",
    name: "Sarah Johnson",
    email: "sarah.seller@example.com", 
    password: "seller123", // In real app, this would be hashed
    role: "seller",
    profileImage: "/api/placeholder/100/100",
    phone: "+1 (555) 987-6543",
    address: "456 Business Ave, Commerce City, State 67890",
    isVerified: true,
    createdAt: "2024-08-20",
    shopName: "Sarah's Boutique",
    shopDescription: "Premium fashion items handpicked for style-conscious customers.",
    followedShops: []
  },
  {
    id: "shop_003",
    name: "Tech Gadgets Pro",
    email: "contact@techgadgets.com",
    password: "tech123",
    role: "seller",
    profileImage: "/api/placeholder/100/100",
    phone: "+1 (555) 555-0123",
    address: "789 Technology Blvd, Silicon Valley, CA 94000",
    isVerified: true,
    createdAt: "2024-07-10",
    shopName: "Tech Gadgets Pro",
    shopDescription: "Latest technology and gadgets for tech enthusiasts and professionals.",
    followedShops: []
  },
  {
    id: "shop_004",
    name: "Artisan Crafts",
    email: "hello@artisancrafts.com",
    password: "craft123",
    role: "seller",
    profileImage: "/api/placeholder/100/100",
    phone: "+1 (555) 555-0456",
    address: "321 Creative Street, Arts District, NY 10001",
    isVerified: false,
    createdAt: "2024-06-05",
    shopName: "Artisan Crafts",
    shopDescription: "Handmade crafts and unique artistic creations by local artisans.",
    followedShops: []
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const validateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};