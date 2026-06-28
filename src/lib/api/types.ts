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

export interface BackendSellerStatus {
  isSeller: boolean;
  hasShop: boolean;
  shopApprovalStatus: 'pending' | 'approved' | 'rejected' | null;
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

export interface BackendProductShopSummary {
  shopName: string;
  slug: string;
  profileImage?: string | null;
}

export interface BackendProduct {
  id: string;
  shopId: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: string;
  originalPrice?: string | null;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  rejectionComment?: string | null;
  images: string[];
  sales: number;
  tags: string[];
  rating: string;
  reviewCount: number;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  shop?: BackendProductShopSummary;
}

export interface BackendProductListResponse {
  items: BackendProduct[];
  total: number;
  page: number;
  pages: number;
}

export interface BackendShop {
  id: string;
  sellerId: string;
  shopName: string;
  slug: string;
  shopDescription?: string | null;
  profileImage?: string | null;
  bannerImage?: string | null;
  courierService?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  shopAddress?: string | null;
  shopEmail?: string | null;
  shopPhone?: string | null;
  socialLinks?: Record<string, string> | null;
  returnPolicy?: string | null;
  returnableItems?: string | null;
  nonReturnableItems?: string | null;
  exchangePolicy?: string | null;
  exchangeConditions?: string | null;
  returnSteps?: string | null;
  refundInfo?: string | null;
  accountStatus: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  pendingProfileChanges?: Record<string, string> | null;
  profileChangeStatus: 'none' | 'pending';
  idType?: string | null;
  idNumber?: string | null;
  nic?: string | null;
  createdAt: string;
  updatedAt: string;
  products?: BackendProduct[];
  _count?: { products: number; followers: number };
}

export interface BackendWishlistItem {
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | null;
    images: string[];
    status: string;
    approvalStatus: string;
    shop: { shopName: string; slug: string };
  };
}

export interface BackendReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  user: { name: string; profileImage?: string | null };
}

export interface BackendBankDetails {
  id: string;
  sellerId: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber?: string | null;
  accountType: 'savings' | 'checking';
  iban?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackendWallet {
  total: number;
  pending: number;
  available: number;
  platformFeePercent: number;
  minimumWithdrawal: number;
}

export interface BackendPayoutTransaction {
  id: string;
  sellerId: string;
  amount: string;
  status: string;
  method: string;
  payoutRequestId?: string | null;
  date: string;
  createdAt: string;
}

export interface BackendPayoutRequest {
  id: string;
  sellerId: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string | null;
  requestDate: string;
  createdAt: string;
}

export interface BackendAdminStats {
  users: { total: number; sellers: number; customers: number };
  orders: { total: number; pending: number };
  products: { pendingApproval: number };
  shops: { pendingApproval: number };
  revenue: { total: number };
}

export interface BackendAdminUser {
  id: string;
  name: string;
  role: 'customer' | 'seller' | 'admin';
  accountStatus: string;
  isVerified: boolean;
  createdAt: string;
}

export interface BackendSiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string | null;
  footerText: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  enableNotifications: boolean;
  updatedAt: string;
}

export interface BackendHeroBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  sellerName?: string | null;
  salePercentage?: number | null;
  validUntil?: string | null;
  createdAt: string;
  updatedAt: string;
}
