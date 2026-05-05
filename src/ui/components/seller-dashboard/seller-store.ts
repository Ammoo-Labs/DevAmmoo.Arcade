// Centralised localStorage store for seller orders, products, payouts and buyer notifications.
// All functions are SSR-safe (check typeof window before accessing localStorage).

export type OrderStatus =
  | "pending"
  | "on_hold"
  | "processing"
  | "packaged"
  | "shipped"
  | "completed"
  | "cancelled";

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

// ─── Keys ────────────────────────────────────────────────────────────────────
const ORDERS_KEY = "ammoo-seller-orders";
const PRODUCTS_KEY = "ammoo-seller-products";
const NOTIFICATIONS_KEY = "ammoo-buyer-notifications";
const BANK_DETAILS_KEY = "ammoo-bank-details";

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
    total: 107.18,
    subtotal: 89.99,
    tax: 7.20,
    shipping: 9.99,
    status: "pending",
    paymentStatus: "paid",
    orderDate: "2025-05-05",
    shippingAddress: "42 Galle Road, Colombo 03, Sri Lanka",
    statusHistory: [{ status: "pending", timestamp: "2025-05-05T08:30:00Z" }],
  },
  {
    id: "ORD-2025-002",
    sellerId: "seller-sarah",
    customer: { name: "Bob Smith", email: "bob@example.com" },
    products: [{ name: "Handmade Silver Necklace", image: "", quantity: 2, price: 65.00, color: "Silver" }],
    total: 149.20,
    subtotal: 130.00,
    tax: 10.40,
    shipping: 8.80,
    status: "on_hold",
    paymentStatus: "paid",
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
    total: 212.15,
    subtotal: 194.99,
    tax: 15.60,
    shipping: 1.56,
    status: "processing",
    paymentStatus: "paid",
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
    total: 96.38,
    subtotal: 79.99,
    tax: 6.40,
    shipping: 9.99,
    status: "packaged",
    paymentStatus: "paid",
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
    total: 107.18,
    subtotal: 89.99,
    tax: 7.20,
    shipping: 9.99,
    status: "shipped",
    paymentStatus: "paid",
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
    total: 171.98,
    subtotal: 149.99,
    tax: 12.00,
    shipping: 9.99,
    status: "completed",
    paymentStatus: "paid",
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
    total: 220.80,
    subtotal: 195.00,
    tax: 15.60,
    shipping: 10.20,
    status: "cancelled",
    paymentStatus: "failed",
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
    id: 101,
    sellerId: "seller-sarah",
    name: "Premium Silk Blouse",
    category: "Fashion",
    price: 89.99,
    originalPrice: 120.00,
    stock: 25,
    status: "active",
    image: "",
    description: "Luxurious silk blouse with relaxed fit. Perfect for casual and formal occasions.",
    sales: 67,
    createdAt: "2025-01-15",
    tags: ["silk", "blouse", "fashion", "women"],
  },
  {
    id: 102,
    sellerId: "seller-sarah",
    name: "Handmade Silver Necklace",
    category: "Jewelry",
    price: 65.00,
    stock: 12,
    status: "active",
    image: "",
    description: "Beautifully crafted sterling silver necklace with a delicate pendant.",
    sales: 43,
    createdAt: "2025-01-20",
    tags: ["silver", "necklace", "jewelry", "handmade"],
  },
  {
    id: 103,
    sellerId: "seller-sarah",
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 149.99,
    originalPrice: 199.99,
    stock: 8,
    status: "active",
    image: "",
    description: "Genuine leather crossbody bag with multiple pockets and adjustable strap.",
    sales: 29,
    createdAt: "2025-02-01",
    tags: ["leather", "bag", "accessories", "crossbody"],
  },
  {
    id: 104,
    sellerId: "seller-sarah",
    name: "Summer Floral Dress",
    category: "Fashion",
    price: 79.99,
    stock: 0,
    status: "inactive",
    image: "",
    description: "Light and breezy floral dress perfect for summer outings.",
    sales: 18,
    createdAt: "2025-02-10",
    tags: ["dress", "summer", "floral", "fashion"],
  },
  {
    id: 105,
    sellerId: "seller-sarah",
    name: "Crystal Drop Earrings",
    category: "Jewelry",
    price: 45.00,
    originalPrice: 60.00,
    stock: 30,
    status: "draft",
    image: "",
    description: "Elegant crystal drop earrings that catch the light beautifully.",
    sales: 0,
    createdAt: "2025-05-01",
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
  trackingNumber?: string
): SellerOrder | null {
  const all = readOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const order = { ...all[idx] };
  order.status = newStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory = [
    ...order.statusHistory,
    { status: newStatus, timestamp: new Date().toISOString() },
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

  return order;
}

// ─── Products ─────────────────────────────────────────────────────────────────
function readProducts(): SellerProduct[] {
  if (typeof window === "undefined") return defaultProducts;
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(raw);
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
    all[idx] = product;
  } else {
    all.unshift(product);
  }
  writeProducts(all);
}

export function deleteSellerProduct(id: number): void {
  writeProducts(readProducts().filter((p) => p.id !== id));
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
    .reduce((s, o) => s + o.total * 0.9, 0); // 10% platform fee

  const pendingRevenue = orders
    .filter((o) => ["shipped", "processing", "packaged"].includes(o.status) && o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total * 0.9, 0);

  const totalPaidOut = txns
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const available = Math.max(0, completedRevenue - totalPaidOut);

  return {
    total: completedRevenue + pendingRevenue,
    pending: pendingRevenue,
    available,
  };
}
