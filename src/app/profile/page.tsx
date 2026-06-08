"use client";

import { useEffect, useState, useRef } from "react";
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
  ShoppingCart,
  Heart,
  Camera,
} from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import Link from "next/link";
import {
  getOrders,
  getStatusLabel,
  SellerOrder,
  OrderStatus,
  StatusHistoryEntry,
} from "@/ui/components/seller-dashboard/seller-store";

const STATUS_CFG: Record<OrderStatus, { icon: React.ReactNode; badge: string }> = {
  pending:    { icon: <Clock className="w-3.5 h-3.5" />,        badge: "bg-yellow-100 text-yellow-800" },
  on_hold:    { icon: <PauseCircle className="w-3.5 h-3.5" />,  badge: "bg-orange-100 text-orange-800" },
  processing: { icon: <Package className="w-3.5 h-3.5" />,      badge: "bg-blue-100 text-blue-800" },
  packaged:   { icon: <Package className="w-3.5 h-3.5" />,      badge: "bg-indigo-100 text-indigo-800" },
  shipped:    { icon: <Truck className="w-3.5 h-3.5" />,        badge: "bg-purple-100 text-purple-800" },
  completed:  { icon: <CheckCircle2 className="w-3.5 h-3.5" />, badge: "bg-green-100 text-green-800" },
  cancelled:  { icon: <AlertCircle className="w-3.5 h-3.5" />,  badge: "bg-red-100 text-red-800" },
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
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);

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
      const allOrders = getOrders();
      setOrders(allOrders.filter((o) => o.customer.email === user.email));
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateUser({ profileImage: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone as any,
      address: form.address as any,
    } as any);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Breadcrumb / nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Profile</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with upload overlay */}
            <div className="relative flex-shrink-0 group">
              {user.profileImage && !user.profileImage.startsWith("/api/") ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center ring-2 ring-gray-200">
                  <User className="w-9 h-9 text-white" />
                </div>
              )}

              {/* Camera overlay — always accessible */}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              <div className="absolute -bottom-1 -right-1">
                {user.isVerified ? (
                  <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400 bg-white rounded-full" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5 capitalize">{user.role} Account</p>
              <span
                className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user.isVerified
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {user.isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
              <p className="text-xs text-gray-400 mt-2">Hover over photo to change it</p>
            </div>

            <ActionButton
              onClick={() => setIsEditing(!isEditing)}
              variant="secondary"
              className="flex items-center gap-2 self-start"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </ActionButton>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name",       label: "Full Name",      placeholder: "Your name",       required: true },
                { key: "email",      label: "Email Address",  placeholder: "you@example.com", required: true },
                { key: "phone",      label: "Contact Number", placeholder: "+94 77 000 0000", required: true },
                { key: "city",       label: "City",           placeholder: "Colombo",         required: false },
                { key: "postalCode", label: "Postal Code",    placeholder: "10100",           required: false },
                { key: "address",    label: "Street Address", placeholder: "123 Main St",     required: false },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
              <ActionButton variant="secondary" onClick={() => setIsEditing(false)}>
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
          {/* Profile Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h3>
            <div className="space-y-3">
              {[
                ["Full Name",      form.name       || "—"],
                ["Email",          form.email      || "—"],
                ["Contact Number", form.phone      || "—"],
                ["City",           form.city       || "—"],
                ["Postal Code",    form.postalCode || "—"],
                ["Address",        form.address    || "—"],
                ["Member Since",   user.createdAt  || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm text-gray-900 text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Followed Shops */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Followed Shops</h3>
            {!user.followedShops || user.followedShops.length === 0 ? (
              <div className="text-center py-8">
                <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No followed shops yet</p>
                <Link
                  href="/products"
                  className="text-sm text-gray-900 font-medium hover:underline mt-2 inline-block"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.followedShops.map((shopId) => (
                  <div
                    key={shopId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{shopId}</span>
                    </div>
                    <Link
                      href={`/shop/${shopId}`}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Orders with Tracking */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
            <p className="text-gray-500 text-sm">Track all your orders in one place</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No orders yet</p>
              <Link
                href="/products"
                className="text-sm text-gray-900 font-medium hover:underline mt-2 inline-block"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isExpanded = expandedOrder === order.id;

                return (
                  <div key={order.id}>
                    <button
                      className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-medium text-gray-900">
                              {order.id}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}
                            >
                              {cfg.icon}
                              {getStatusLabel(order.status)}
                            </span>
                            {order.trackingNumber && (
                              <span className="text-xs text-gray-400 font-mono">
                                📦 {order.trackingNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {order.orderDate} · {order.products.length} item
                            {order.products.length > 1 ? "s" : ""} · ${order.total.toFixed(2)}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-5 bg-gray-50 border-t border-gray-100">
                        {/* Items */}
                        <div className="space-y-2 pt-4">
                          {order.products.map((p, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-start bg-white rounded-lg border border-gray-200 p-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                <p className="text-xs text-gray-500">
                                  Qty: {p.quantity}
                                  {p.size ? ` · Size: ${p.size}` : ""}
                                  {p.color ? ` · ${p.color}` : ""}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                ${(p.price * p.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Totals */}
                        <div className="bg-white rounded-lg border border-gray-200 p-3 text-sm space-y-1">
                          <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span>
                              {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-1 mt-1">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Shipping address */}
                        <p className="text-xs text-gray-500">📍 {order.shippingAddress}</p>

                        {/* Order timeline */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                            Order Timeline
                          </h4>
                          <div className="relative space-y-0">
                            {order.statusHistory.map((entry: StatusHistoryEntry, idx: number) => {
                              const eCfg = STATUS_CFG[entry.status];
                              const isLast = idx === order.statusHistory.length - 1;
                              return (
                                <div key={idx} className="flex gap-3 pb-4 relative">
                                  {!isLast && (
                                    <div className="absolute left-[13px] top-6 bottom-0 w-0.5 bg-gray-200" />
                                  )}
                                  <div
                                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 ${eCfg.badge}`}
                                  >
                                    {eCfg.icon}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {getStatusLabel(entry.status)}
                                    </p>
                                    {entry.note && (
                                      <p className="text-xs text-gray-500 italic">{entry.note}</p>
                                    )}
                                    <p className="text-xs text-gray-400">
                                      {new Date(entry.timestamp).toLocaleString()}
                                    </p>
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

        {/* Quick Actions */}
        {user.role === "customer" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Browse Products", href: "/products", icon: Package },
                { label: "View Cart",       href: "/cart",     icon: ShoppingCart },
                { label: "Wishlist",        href: "/products", icon: Heart },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors group"
                >
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
