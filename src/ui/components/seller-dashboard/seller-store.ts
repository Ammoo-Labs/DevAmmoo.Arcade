// Centralised localStorage store for seller orders, products, payouts, profiles, and buyer notifications.
// All functions are SSR-safe (check typeof window before accessing localStorage).

// ─── Order types ──────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "on_hold"
  | "processing"
  | "packaged"
  | "shipped"
  | "completed"
  | "cancelled";

// ─── Post / product approval ──────────────────────────────────────────────────
export type PostApprovalStatus = "pending" | "approved" | "rejected" | "under_review";

// ─── Seller account status ────────────────────────────────────────────────────
export type SellerAccountStatus = "active" | "suspended" | "banned";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface OrderProduct {
  name: string;
  image: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface SellerOrder {
  id: string;
  sellerId: string;
  customer: {
    name: string;
    email: string;
  };
  products: OrderProduct[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "failed";
  orderDate: string;
  shippingAddress: string;
  trackingNumber?: string;
  handoverProof?: string;      // base64 image/doc uploaded by seller
  adminReviewed?: boolean;     // admin has seen the latest update
  statusHistory: StatusHistoryEntry[];
}

export interface SellerProduct {
  id: number;
  sellerId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  approvalStatus: PostApprovalStatus;
  rejectionComment?: string;
  image: string;
  description: string;
  sales: number;
  createdAt: string;
  tags?: string[];
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "savings" | "checking";
  iban?: string;
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  method: string;
}

export interface BuyerNotification {
  id: string;
  orderId: string;
  buyerEmail: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "shipped" | "cancelled" | "on_hold" | "processing" | "completed" | "general";
}

// Seller profile: shop-specific data saved to localStorage
export interface SellerProfile {
  sellerId: string;
  shopName?: string;
  shopDescription?: string;
  profileImage?: string;
  bannerImage?: string;
  courierService?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  shopAddress?: string;
  shopEmail?: string;
  shopPhone?: string;
  returnPolicy?: string;
  returnableitems?: string;
  nonReturnableItems?: string;
  exchangePolicy?: string;
  exchangeConditions?: string;
  returnSteps?: string;
  refundInfo?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Sensitive-field change approval
  pendingProfileChanges?: Partial<SellerProfile>;
  profileChangeStatus?: "none" | "pending";
}

// Payout request submitted by seller
export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  shopName: string;
  amount: number;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  bankDetails?: Partial<BankDetails>;
  adminNote?: string;
}

// User profile overrides (for profile image, phone, address persisted in localStorage)
export interface UserProfileOverride {
  profileImage?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  name?: string;
}

// ─── Keys ────────────────────────────────────────────────────────────────────
const ORDERS_KEY = "ammoo-seller-orders";
const PRODUCTS_KEY = "ammoo-seller-products";
const NOTIFICATIONS_KEY = "ammoo-buyer-notifications";
const BANK_DETAILS_KEY = "ammoo-bank-details";
const SELLER_PROFILES_KEY = "ammoo-seller-profiles";
const PAYOUT_REQUESTS_KEY = "ammoo-payout-requests";
const SELLER_STATUS_KEY = "ammoo-seller-status";
const USER_OVERRIDES_KEY = "ammoo-user-overrides";

// ─── Status helpers ───────────────────────────────────────────────────────────
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: "New / Pending",
    on_hold: "On Hold",
    processing: "Processing / Packaged",
    packaged: "Packaged",
    shipped: "Shipped / Dispatched",
    completed: "Completed / Finalized",
    cancelled: "Cancelled",
  };
  return labels[status];
}

export function getAllowedTransitions(current: OrderStatus): OrderStatus[] {
  const map: Record<OrderStatus, OrderStatus[]> = {
    pending: ["on_hold", "processing", "cancelled"],
    on_hold: ["processing", "cancelled"],
    processing: ["packaged", "cancelled"],
    packaged: ["shipped", "cancelled"],
    shipped: ["completed"],
    completed: [],
    cancelled: [],
  };
  return map[current];
}

export function getNotificationMessage(orderId: string, status: OrderStatus): string {
  const msgs: Record<OrderStatus, string> = {
    pending: `Your order ${orderId} has been received and is awaiting processing.`,
    on_hold: `Your order ${orderId} has been placed on hold. The seller will update you shortly.`,
    processing: `Great news! Your order ${orderId} is now being processed and packaged.`,
    packaged: `Your order ${orderId} has been packaged and is ready for dispatch.`,
    shipped: `Your order ${orderId} is on its way! Check your tracking number for live updates.`,
    completed: `Your order ${orderId} is now complete. Thank you for shopping with us!`,
    cancelled: `Your order ${orderId} has been cancelled. A full refund will be processed within 3–5 business days.`,
  };
  return msgs[status];
}

export function getNotificationType(status: OrderStatus): BuyerNotification["type"] {
  if (status === "shipped") return "shipped";
  if (status === "cancelled") return "cancelled";
  if (status === "on_hold") return "on_hold";
  if (status === "processing" || status === "packaged") return "processing";
  if (status === "completed") return "completed";
  return "general";
}

// ─── Demo data ────────────────────────────────────────────────────────────────
const defaultOrders: SellerOrder[] = [
  {
    id: "ORD-2025-001",
    sellerId: "seller-sarah",
    customer: { name: "Alice Johnson", email: "alice@example.com" },
    products: [{ name: "Premium Silk Blouse", image: "", quantity: 1, price: 89.99, size: "M", color: "White" }],
    total: 107.18, subtotal: 89.99, tax: 7.20, shipping: 9.99,
    status: "pending", paymentStatus: "paid",
    orderDate: "2025-05-05",
    shippingAddress: "42 Galle Road, Colombo 03, Sri Lanka",
    statusHistory: [{ status: "pending", timestamp: "2025-05-05T08:30:00Z" }],
  },
  {
    id: "ORD-2025-002",
    sellerId: "seller-sarah",
    customer: { name: "Bob Smith", email: "bob@example.com" },
    products: [{ name: "Handmade Silver Necklace", image: "", quantity: 2, price: 65.00, color: "Silver" }],
    total: 149.20, subtotal: 130.00, tax: 10.40, shipping: 8.80,
    status: "on_hold", paymentStatus: "paid",
    orderDate: "2025-05-04",
    shippingAddress: "15 Kandy Road, Peradeniya, Sri Lanka",
    statusHistory: [
      { status: "pending", timestamp: "2025-05-04T10:00:00Z" },
      { status: "on_hold", timestamp: "2025-05-04T14:25:00Z", note: "Verifying stock availability" },
    ],
  },
  {
    id: "ORD-2025-003",
    sellerId: "seller-sarah",
    customer: { name: "Carol Davis", email: "carol@example.com" },
    products: [
      { name: "Leather Crossbody Bag", image: "", quantity: 1, price: 149.99, color: "Brown" },
      { name: "Crystal Drop Earrings", image: "", quantity: 1, price: 45.00 },
    ],
    total: 212.15, subtotal: 194.99, tax: 15.60, shipping: 1.56,
    status: "processing", paymentStatus: "paid",
    orderDate: "2025-05-03",
    shippingAddress: "78 Marine Drive, Negombo, Sri Lanka",
    statusHistory: [
      { status: "pending", timestamp: "2025-05-03T09:15:00Z" },
      { status: "processing", timestamp: "2025-05-03T11:30:00Z" },
    ],
  },
  {
    id: "ORD-2025-004",
    sellerId: "seller-sarah",
    customer: { name: "David Wilson", email: "david@example.com" },
    products: [{ name: "Summer Floral Dress", image: "", quantity: 1, price: 79.99, size: "S", color: "Blue" }],
    total: 96.38, subtotal: 79.99, tax: 6.40, shipping: 9.99,
    status: "packaged", paymentStatus: "paid",
    orderDate: "2025-05-02",
    shippingAddress: "23 Hill Street, Nuwara Eliya, Sri Lanka",
    statusHistory: [
      { status: "pending", timestamp: "2025-05-02T07:00:00Z" },
      { status: "processing", timestamp: "2025-05-02T10:00:00Z" },
      { status: "packaged", timestamp: "2025-05-02T15:45:00Z" },
    ],
  },
  {
    id: "ORD-2025-005",
    sellerId: "seller-sarah",
    customer: { name: "Eva Brown", email: "eva@example.com" },
    products: [{ name: "Premium Silk Blouse", image: "", quantity: 1, price: 89.99, size: "L", color: "Pink" }],
    total: 107.18, subtotal: 89.99, tax: 7.20, shipping: 9.99,
    status: "shipped", paymentStatus: "paid",
    orderDate: "2025-04-30",
    shippingAddress: "56 Baseline Road, Colombo 09, Sri Lanka",
    trackingNumber: "SLPost-LP123456789LK",
    statusHistory: [
      { status: "pending", timestamp: "2025-04-30T08:00:00Z" },
      { status: "processing", timestamp: "2025-04-30T10:30:00Z" },
      { status: "packaged", timestamp: "2025-04-30T14:00:00Z" },
      { status: "shipped", timestamp: "2025-05-01T09:00:00Z" },
    ],
  },
  {
    id: "ORD-2025-006",
    sellerId: "seller-sarah",
    customer: { name: "Frank Miller", email: "frank@example.com" },
    products: [{ name: "Leather Crossbody Bag", image: "", quantity: 1, price: 149.99, color: "Black" }],
    total: 171.98, subtotal: 149.99, tax: 12.00, shipping: 9.99,
    status: "completed", paymentStatus: "paid",
    orderDate: "2025-04-25",
    shippingAddress: "90 Gampaha Road, Gampaha, Sri Lanka",
    trackingNumber: "DHL-1234567890",
    statusHistory: [
      { status: "pending", timestamp: "2025-04-25T09:00:00Z" },
      { status: "processing", timestamp: "2025-04-25T11:00:00Z" },
      { status: "packaged", timestamp: "2025-04-26T08:00:00Z" },
      { status: "shipped", timestamp: "2025-04-27T07:00:00Z" },
      { status: "completed", timestamp: "2025-04-30T14:30:00Z" },
    ],
  },
  {
    id: "ORD-2025-007",
    sellerId: "seller-sarah",
    customer: { name: "Grace Lee", email: "grace@example.com" },
    products: [{ name: "Handmade Silver Necklace", image: "", quantity: 3, price: 65.00 }],
    total: 220.80, subtotal: 195.00, tax: 15.60, shipping: 10.20,
    status: "cancelled", paymentStatus: "failed",
    orderDate: "2025-04-28",
    shippingAddress: "34 Station Road, Galle, Sri Lanka",
    statusHistory: [
      { status: "pending", timestamp: "2025-04-28T12:00:00Z" },
      { status: "cancelled", timestamp: "2025-04-28T16:00:00Z", note: "Items out of stock — full refund initiated" },
    ],
  },
];

const defaultProducts: SellerProduct[] = [
  {
    id: 101, sellerId: "seller-sarah", name: "Premium Silk Blouse", category: "Fashion",
    price: 89.99, originalPrice: 120.00, stock: 25, status: "active", approvalStatus: "approved",
    image: "", description: "Luxurious silk blouse with relaxed fit.", sales: 67, createdAt: "2025-01-15",
    tags: ["silk", "blouse", "fashion", "women"],
  },
  {
    id: 102, sellerId: "seller-sarah", name: "Handmade Silver Necklace", category: "Jewelry",
    price: 65.00, stock: 12, status: "active", approvalStatus: "approved",
    image: "", description: "Beautifully crafted sterling silver necklace.", sales: 43, createdAt: "2025-01-20",
    tags: ["silver", "necklace", "jewelry", "handmade"],
  },
  {
    id: 103, sellerId: "seller-sarah", name: "Leather Crossbody Bag", category: "Accessories",
    price: 149.99, originalPrice: 199.99, stock: 8, status: "active", approvalStatus: "approved",
    image: "", description: "Genuine leather crossbody bag.", sales: 29, createdAt: "2025-02-01",
    tags: ["leather", "bag", "accessories", "crossbody"],
  },
  {
    id: 104, sellerId: "seller-sarah", name: "Summer Floral Dress", category: "Fashion",
    price: 79.99, stock: 0, status: "inactive", approvalStatus: "approved",
    image: "", description: "Light and breezy floral dress.", sales: 18, createdAt: "2025-02-10",
    tags: ["dress", "summer", "floral", "fashion"],
  },
  {
    id: 105, sellerId: "seller-sarah", name: "Crystal Drop Earrings", category: "Jewelry",
    price: 45.00, originalPrice: 60.00, stock: 30, status: "draft", approvalStatus: "pending",
    image: "", description: "Elegant crystal drop earrings.", sales: 0, createdAt: "2025-05-01",
    tags: ["earrings", "crystal", "jewelry"],
  },
];

const defaultBankDetails: BankDetails = {
  bankName: "Commercial Bank of Ceylon",
  accountHolder: "Sarah Silva",
  accountNumber: "1234567890",
  routingNumber: "CCEYLKLX",
  accountType: "savings",
  iban: "",
};

export const defaultTransactions: PayoutTransaction[] = [
  { id: "TXN-001", amount: 500.00, date: "2025-04-15", status: "completed", method: "Bank Transfer" },
  { id: "TXN-002", amount: 750.00, date: "2025-03-28", status: "completed", method: "Bank Transfer" },
  { id: "TXN-003", amount: 300.00, date: "2025-03-10", status: "completed", method: "Bank Transfer" },
];

export const MINIMUM_WITHDRAWAL = 50;

// ─── Orders ───────────────────────────────────────────────────────────────────
function readOrders(): SellerOrder[] {
  if (typeof window === "undefined") return defaultOrders;
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultOrders));
    return defaultOrders;
  }
  return JSON.parse(raw);
}

function writeOrders(orders: SellerOrder[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrders(sellerId?: string): SellerOrder[] {
  const all = readOrders();
  return sellerId ? all.filter((o) => o.sellerId === sellerId) : all;
}

export function addOrder(order: SellerOrder): void {
  const all = readOrders();
  all.unshift(order);
  writeOrders(all);
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  options?: { trackingNumber?: string; handoverProof?: string; note?: string }
): SellerOrder | null {
  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const order = { ...all[idx] };
  order.status = newStatus;
  order.adminReviewed = false; // reset so admin sees the update
  if (options?.trackingNumber) order.trackingNumber = options.trackingNumber;
  if (options?.handoverProof) order.handoverProof = options.handoverProof;
  order.statusHistory = [
    ...order.statusHistory,
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      ...(options?.note ? { note: options.note } : {}),
    },
  ];
  all[idx] = order;
  writeOrders(all);

  // Push buyer notification
  const notif: BuyerNotification = {
    id: `NOTIF-${Date.now()}`,
    orderId,
    buyerEmail: order.customer.email,
    message: getNotificationMessage(orderId, newStatus),
    timestamp: new Date().toISOString(),
    read: false,
    type: getNotificationType(newStatus),
  };
  const notifs = readNotifications();
  notifs.unshift(notif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));

  // Modular tracking notification hook — replace with AI agent call later
  if (newStatus === "shipped" && options?.trackingNumber) {
    sendTrackingNotification(orderId, options.trackingNumber, order.customer.email);
  }

  return order;
}

export function markOrderAdminReviewed(orderId: string): void {
  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return;
  all[idx] = { ...all[idx], adminReviewed: true };
  writeOrders(all);
}

// Modular notification stub — swap this function for an AI agent call when ready
export function sendTrackingNotification(
  orderId: string,
  trackingNumber: string,
  buyerEmail: string
): void {
  // Currently: creates an in-app notification record.
  // TODO: Replace body of this function with AI agent / email API call.
  const record = {
    id: `TRACK-${Date.now()}`,
    orderId,
    trackingNumber,
    buyerEmail,
    sentAt: new Date().toISOString(),
    method: "in_app",
  };
  if (typeof window !== "undefined") {
    const existing = JSON.parse(localStorage.getItem("ammoo-tracking-notifications") || "[]");
    existing.unshift(record);
    localStorage.setItem("ammoo-tracking-notifications", JSON.stringify(existing));
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────
function readProducts(): SellerProduct[] {
  if (typeof window === "undefined") return defaultProducts;
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  const parsed: SellerProduct[] = JSON.parse(raw);
  // Migrate old records that don't have approvalStatus
  return parsed.map((p) => ({
    ...p,
    approvalStatus: p.approvalStatus ?? "approved",
  }));
}

function writeProducts(products: SellerProduct[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getSellerProducts(sellerId?: string): SellerProduct[] {
  const all = readProducts();
  return sellerId ? all.filter((p) => p.sellerId === sellerId) : all;
}

export function saveSellerProduct(product: SellerProduct): void {
  const all = readProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    // Editing existing product → reset to pending for re-approval
    all[idx] = { ...product, approvalStatus: "pending", rejectionComment: undefined };
  } else {
    // New product → starts as pending
    all.unshift({ ...product, approvalStatus: "pending" });
  }
  writeProducts(all);
}

export function deleteSellerProduct(id: number): void {
  writeProducts(readProducts().filter((p) => p.id !== id));
}

// ─── Post approval (admin actions) ───────────────────────────────────────────
export function approveProduct(id: number): void {
  const all = readProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], approvalStatus: "approved", rejectionComment: undefined };
  writeProducts(all);
}

export function rejectProduct(id: number, comment: string): void {
  const all = readProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], approvalStatus: "rejected", rejectionComment: comment };
  writeProducts(all);
}

export function setProductUnderReview(id: number): void {
  const all = readProducts();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], approvalStatus: "under_review" };
  writeProducts(all);
}

// ─── Notifications ────────────────────────────────────────────────────────────
function readNotifications(): BuyerNotification[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(NOTIFICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getBuyerNotifications(buyerEmail?: string): BuyerNotification[] {
  const all = readNotifications();
  return buyerEmail ? all.filter((n) => n.buyerEmail === buyerEmail) : all;
}

// ─── Bank Details & Payouts ───────────────────────────────────────────────────
export function getBankDetails(sellerId: string): BankDetails {
  if (typeof window === "undefined") return defaultBankDetails;
  const raw = localStorage.getItem(`${BANK_DETAILS_KEY}-${sellerId}`);
  return raw ? JSON.parse(raw) : defaultBankDetails;
}

export function saveBankDetails(sellerId: string, details: BankDetails): void {
  localStorage.setItem(`${BANK_DETAILS_KEY}-${sellerId}`, JSON.stringify(details));
}

export function getTransactions(sellerId: string): PayoutTransaction[] {
  if (typeof window === "undefined") return defaultTransactions;
  const raw = localStorage.getItem(`ammoo-transactions-${sellerId}`);
  if (!raw) {
    localStorage.setItem(`ammoo-transactions-${sellerId}`, JSON.stringify(defaultTransactions));
    return defaultTransactions;
  }
  return JSON.parse(raw);
}

export function addTransaction(sellerId: string, txn: PayoutTransaction): void {
  const all = getTransactions(sellerId);
  all.unshift(txn);
  localStorage.setItem(`ammoo-transactions-${sellerId}`, JSON.stringify(all));
}

export function getWalletBalance(sellerId: string): {
  total: number;
  pending: number;
  available: number;
} {
  const orders = getOrders(sellerId);
  const txns = getTransactions(sellerId);

  const completedRevenue = orders
    .filter((o) => o.status === "completed" && o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total * 0.9, 0);

  const pendingRevenue = orders
    .filter((o) => ["shipped", "processing", "packaged"].includes(o.status) && o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total * 0.9, 0);

  const totalPaidOut = txns
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const available = Math.max(0, completedRevenue - totalPaidOut);

  return { total: completedRevenue + pendingRevenue, pending: pendingRevenue, available };
}

// ─── Payout Requests ──────────────────────────────────────────────────────────
function readPayoutRequests(): PayoutRequest[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PAYOUT_REQUESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writePayoutRequests(reqs: PayoutRequest[]): void {
  localStorage.setItem(PAYOUT_REQUESTS_KEY, JSON.stringify(reqs));
}

export function getPayoutRequests(sellerId?: string): PayoutRequest[] {
  const all = readPayoutRequests();
  return sellerId ? all.filter((r) => r.sellerId === sellerId) : all;
}

export function addPayoutRequest(req: PayoutRequest): void {
  const all = readPayoutRequests();
  all.unshift(req);
  writePayoutRequests(all);
}

export function updatePayoutRequestStatus(
  id: string,
  status: PayoutRequest["status"],
  adminNote?: string
): void {
  const all = readPayoutRequests();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], status, ...(adminNote ? { adminNote } : {}) };
  writePayoutRequests(all);
}

// ─── Seller Profiles ──────────────────────────────────────────────────────────
function readSellerProfiles(): Record<string, SellerProfile> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SELLER_PROFILES_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeSellerProfiles(profiles: Record<string, SellerProfile>): void {
  localStorage.setItem(SELLER_PROFILES_KEY, JSON.stringify(profiles));
}

export function getSellerProfile(sellerId: string): SellerProfile {
  const profiles = readSellerProfiles();
  return profiles[sellerId] ?? { sellerId };
}

export function saveSellerProfile(sellerId: string, data: Partial<SellerProfile>): void {
  const profiles = readSellerProfiles();
  profiles[sellerId] = { ...(profiles[sellerId] ?? { sellerId }), ...data, sellerId };
  writeSellerProfiles(profiles);
}

// Save sensitive field changes: they go into pendingProfileChanges and flag as pending
export function submitSensitiveProfileChanges(
  sellerId: string,
  changes: Pick<SellerProfile, "email" | "phone" | "address">
): void {
  const profiles = readSellerProfiles();
  const existing = profiles[sellerId] ?? { sellerId };
  profiles[sellerId] = {
    ...existing,
    pendingProfileChanges: { ...existing.pendingProfileChanges, ...changes },
    profileChangeStatus: "pending",
    sellerId,
  };
  writeSellerProfiles(profiles);
  // Suspend the seller until admin approves
  setSellerAccountStatus(sellerId, "suspended");
}

export function approveProfileChanges(sellerId: string): void {
  const profiles = readSellerProfiles();
  const existing = profiles[sellerId];
  if (!existing?.pendingProfileChanges) return;
  profiles[sellerId] = {
    ...existing,
    ...existing.pendingProfileChanges,
    pendingProfileChanges: undefined,
    profileChangeStatus: "none",
    sellerId,
  };
  writeSellerProfiles(profiles);
  setSellerAccountStatus(sellerId, "active");
}

export function rejectProfileChanges(sellerId: string): void {
  const profiles = readSellerProfiles();
  const existing = profiles[sellerId];
  if (!existing) return;
  profiles[sellerId] = {
    ...existing,
    pendingProfileChanges: undefined,
    profileChangeStatus: "none",
    sellerId,
  };
  writeSellerProfiles(profiles);
  setSellerAccountStatus(sellerId, "active");
}

// ─── Seller Account Status ────────────────────────────────────────────────────
function readSellerStatuses(): Record<string, SellerAccountStatus> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SELLER_STATUS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeSellerStatuses(statuses: Record<string, SellerAccountStatus>): void {
  localStorage.setItem(SELLER_STATUS_KEY, JSON.stringify(statuses));
}

export function getSellerAccountStatus(sellerId: string): SellerAccountStatus {
  return readSellerStatuses()[sellerId] ?? "active";
}

export function setSellerAccountStatus(sellerId: string, status: SellerAccountStatus): void {
  const statuses = readSellerStatuses();
  statuses[sellerId] = status;
  writeSellerStatuses(statuses);
}

// ─── User Profile Overrides ───────────────────────────────────────────────────
function readUserOverrides(): Record<string, UserProfileOverride> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(USER_OVERRIDES_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getUserOverride(userId: string): UserProfileOverride {
  return readUserOverrides()[userId] ?? {};
}

export function saveUserOverride(userId: string, partial: Partial<UserProfileOverride>): void {
  const overrides = readUserOverrides();
  overrides[userId] = { ...(overrides[userId] ?? {}), ...partial };
  localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(overrides));
}
