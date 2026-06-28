// Shared types that mirror the NestJS backend responses.

export interface BackendProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  profileImage?: string | null;
  phone?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  accountStatus: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  shop?: BackendShopSummary | null;
}

export interface BackendShopSummary {
  id: string;
  shopName: string;
  slug: string;
  profileImage?: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  accountStatus: string;
}

export interface BackendCartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | null;
    images: string[];
    stock: number;
    status: string;
    approvalStatus: string;
    shop: { shopName: string; slug: string };
  };
}

export interface BackendCart {
  items: BackendCartItem[];
  subtotal: number;
  itemCount: number;
}

export interface BackendOrder {
  id: string;
  buyerId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  shippingAddress: string;
  trackingNumber?: string | null;
  handoverProof?: string | null;
  adminReviewed: boolean;
  statusHistory: unknown[];
  orderDate: string;
  createdAt: string;
  items: BackendOrderItem[];
}

export interface BackendOrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface BackendNotification {
  id: string;
  userId: string;
  orderId?: string | null;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}
