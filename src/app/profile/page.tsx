"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/ui/components/auth/auth-context";
import {
  User,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  ChevronDown,
  ChevronUp,
  Store,
  ExternalLink,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import Link from "next/link";
import { getOrders, getStatusLabel, SellerOrder, OrderStatus, StatusHistoryEntry } from "@/ui/components/seller-dashboard/seller-store";

// ─── Order status config (reused from seller-store types) ─────────────────────
const STATUS_CFG: Record<OrderStatus, { icon: React.ReactNode; badge: string }> = {
  pending:    { icon: <Clock className="w-3.5 h-3.5" />,       badge: "bg-yellow-100 text-yellow-800" },
  on_hold:    { icon: <PauseCircle className="w-3.5 h-3.5" />, badge: "bg-orange-100 text-orange-800" },
  processing: { icon: <Package className="w-3.5 h-3.5" />,     badge: "bg-blue-100 text-blue-800" },
  packaged:   { icon: <Package className="w-3.5 h-3.5" />,     badge: "bg-indigo-100 text-indigo-800" },
  shipped:    { icon: <Truck className="w-3.5 h-3.5" />,       badge: "bg-purple-100 text-purple-800" },
  completed:  { icon: <CheckCircle2 className="w-3.5 h-3.5" />,badge: "bg-green-100 text-green-800" },
  cancelled:  { icon: <AlertCircle className="w-3.5 h-3.5" />, badge: "bg-red-100 text-red-800" },
};

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: "", email: "", phone: "", address: "", postalCode: "", city: "",
  });
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.push("/signin");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: (user as any).phone ?? "",
        address: (user as any).address ?? "",
        postalCode: (user as any).postalCode ?? "",
        city: (user as any).city ?? "",
      });
      // Load buyer's orders (match by email)
      const allOrders = getOrders();
      setOrders(allOrders.filter((o) => o.customer.email === user.email));
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    // In a real app we'd persist via API; here just close the form
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Top nav ── */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* ── Profile Header ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-700" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-gray-700">
                  <User className="w-9 h-9 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1">
                {user.isVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-400 bg-gray-900 rounded-full" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400 bg-gray-900 rounded-full" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400 capitalize text-sm mt-0.5">{user.role} Account</p>
              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                user.isVerified ? "bg-green-900/50 text-green-400 border border-green-800" : "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
              }`}>
                {user.isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            <ActionButton
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2 self-start"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </ActionButton>
          </div>
        </div>

        {/* ── Edit Profile Form ── */}
        {isEditing && (
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name",       label: "Full Name",       placeholder: "Your name",        required: true },
                { key: "email",      label: "Email Address",   placeholder: "you@example.com",  required: true },
                { key: "phone",      label: "Contact Number",  placeholder: "+94 77 000 0000",  required: true },
                { key: "city",       label: "City",            placeholder: "Colombo",          required: false },
                { key: "postalCode", label: "Postal Code",     placeholder: "10100",            required: false },
                { key: "address",    label: "Street Address",  placeholder: "123 Main St",      required: false },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-transparent text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <ActionButton variant="secondary" onClick={() => setIsEditing(false)}
                className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Cancel
              </ActionButton>
              <ActionButton onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </ActionButton>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Profile Details (view mode) ── */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Profile Details</h3>
            {[
              ["Full Name",      form.name      || "—"],
              ["Email",          form.email     || "—"],
              ["Contact Number", form.phone     || "—"],
              ["City",           form.city      || "—"],
              ["Postal Code",    form.postalCode|| "—"],
              ["Address",        form.address   || "—"],
              ["Member Since",   user.createdAt || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm text-gray-200 text-right max-w-xs">{value}</span>
              </div>
            ))}
          </div>

          {/* ── Followed Shops ── */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Followed Shops</h3>
            {!user.followedShops || user.followedShops.length === 0 ? (
              <div className="text-center py-8">
                <Store className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No followed shops yet</p>
                <Link href="/products" className="text-sm text-gray-400 hover:text-white underline mt-2 inline-block">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.followedShops.map((shopId) => (
                  <div key={shopId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-200 font-medium">{shopId}</span>
                    </div>
                    <Link href={`/shop/${shopId}`} className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── My Orders with Tracking ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">My Orders</h3>
            <p className="text-gray-400 text-sm">Track all your orders in one place</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
              <Link href="/products" className="text-sm text-gray-400 hover:text-white underline mt-2 inline-block">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {orders.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id}>
                    {/* Order Row */}
                    <button
                      className="w-full text-left px-6 py-4 hover:bg-gray-800/50 transition-colors"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-medium text-gray-200">{order.id}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                              {cfg.icon}
                              {getStatusLabel(order.status)}
                            </span>
                            {order.trackingNumber && (
                              <span className="text-xs text-gray-500 font-mono">📦 {order.trackingNumber}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.orderDate} · {order.products.length} item{order.products.length > 1 ? "s" : ""} · ${order.total.toFixed(2)}
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      </div>
                    </button>

                    {/* Expanded: items + timeline */}
                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-5 bg-gray-800/30">
                        {/* Items */}
                        <div className="space-y-2">
                          {order.products.map((p, i) => (
                            <div key={i} className="flex justify-between items-start bg-gray-800 rounded-lg p-3">
                              <div>
                                <p className="text-sm font-medium text-gray-200">{p.name}</p>
                                <p className="text-xs text-gray-500">
                                  Qty: {p.quantity}{p.size ? ` · Size: ${p.size}` : ""}{p.color ? ` · ${p.color}` : ""}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-300">${(p.price * p.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="bg-gray-800 rounded-lg p-3 text-sm space-y-1">
                          <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Shipping</span><span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between font-bold text-white border-t border-gray-700 pt-1 mt-1">
                            <span>Total</span><span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Shipping address */}
                        <p className="text-xs text-gray-500">📍 {order.shippingAddress}</p>

                        {/* Order timeline */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Order Timeline</h4>
                          <div className="relative space-y-0">
                            {order.statusHistory.map((entry: StatusHistoryEntry, idx: number) => {
                              const eCfg = STATUS_CFG[entry.status];
                              const isLast = idx === order.statusHistory.length - 1;
                              return (
                                <div key={idx} className="flex gap-3 pb-4 relative">
                                  {!isLast && (
                                    <div className="absolute left-[13px] top-6 bottom-0 w-0.5 bg-gray-700" />
                                  )}
                                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 ${eCfg.badge}`}>
                                    {eCfg.icon}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-200">{getStatusLabel(entry.status)}</p>
                                    {entry.note && <p className="text-xs text-gray-500 italic">{entry.note}</p>}
                                    <p className="text-xs text-gray-600">{new Date(entry.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        {user.role === "customer" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Browse Products", href: "/products", icon: Package },
                { label: "View Cart",       href: "/cart",     icon: Package },
                { label: "Back to Home",    href: "/",         icon: Store },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 rounded-lg transition-all group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
