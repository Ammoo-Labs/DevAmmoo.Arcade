"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Bell,
} from "lucide-react";
import { Button } from "@/ui/components/button";
import {
  getOrders,
  getStatusLabel,
  SellerOrder,
  OrderStatus,
  StatusHistoryEntry,
  markOrderAdminReviewed,
} from "@/ui/components/seller-dashboard/seller-store";

const STATUS_CFG: Record<
  OrderStatus,
  { badge: string; icon: React.ReactNode; label: string }
> = {
  pending:    { badge: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" />,       label: "New / Pending" },
  on_hold:    { badge: "bg-orange-100 text-orange-800",  icon: <PauseCircle className="w-3.5 h-3.5" />, label: "On Hold" },
  processing: { badge: "bg-blue-100 text-blue-800",      icon: <Package className="w-3.5 h-3.5" />,     label: "Processing" },
  packaged:   { badge: "bg-indigo-100 text-indigo-800",  icon: <Package className="w-3.5 h-3.5" />,     label: "Packaged" },
  shipped:    { badge: "bg-purple-100 text-purple-800",  icon: <Truck className="w-3.5 h-3.5" />,       label: "Shipped" },
  completed:  { badge: "bg-green-100 text-green-800",    icon: <CheckCircle2 className="w-3.5 h-3.5" />,label: "Completed" },
  cancelled:  { badge: "bg-red-100 text-red-800",        icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Cancelled" },
};

export function OrderManagement() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [unreviewed, setUnreviewed] = useState(0);

  const reload = () => {
    const all = getOrders();
    setOrders(all);
    setUnreviewed(all.filter((o) => !o.adminReviewed).length);
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.sellerId.toLowerCase().includes(q) ||
      (o.trackingNumber ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts: Record<string, number> = { all: orders.length };
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });

  const totalRevenue = orders
    .filter((o) => o.status === "completed" && o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total, 0);

  const openDetail = (order: SellerOrder) => {
    setSelectedOrder(order);
    if (!order.adminReviewed) {
      markOrderAdminReviewed(order.id);
      reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">View all orders across every seller</p>
        </div>
        {unreviewed > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <Bell className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 font-medium">{unreviewed} new update{unreviewed > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",     value: orders.length,          color: "text-gray-900" },
          { label: "Pending",          value: counts.pending ?? 0,    color: "text-yellow-700" },
          { label: "Shipped",          value: counts.shipped ?? 0,    color: "text-purple-700" },
          { label: "Revenue (Completed)", value: `$${totalRevenue.toFixed(0)}`, color: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "on_hold", "processing", "packaged", "shipped", "completed", "cancelled"] as const).map((s) => {
          const cfg = s !== "all" ? STATUS_CFG[s] : null;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cfg?.icon}
              <span>{s === "all" ? "All" : getStatusLabel(s)}</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${active ? "bg-white bg-opacity-20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {counts[s] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, seller, or tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isNew = !order.adminReviewed;
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50 transition-colors ${isNew ? "bg-yellow-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-400">{order.orderDate}</p>
                      {isNew && (
                        <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded-full">New</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.sellerId}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>
                        {cfg.icon}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.trackingNumber ? (
                        <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No orders match your filter.</p>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold font-mono">{selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">{selectedOrder.orderDate}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status + tracking */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_CFG[selectedOrder.status].badge}`}>
                  {STATUS_CFG[selectedOrder.status].icon}
                  {getStatusLabel(selectedOrder.status)}
                </span>
                {selectedOrder.trackingNumber && (
                  <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg text-gray-800">
                    📦 Tracking: {selectedOrder.trackingNumber}
                  </span>
                )}
                {selectedOrder.handoverProof && (
                  <a
                    href={selectedOrder.handoverProof}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    View Handover Proof
                  </a>
                )}
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-gray-500">📍 {selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Seller */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller</p>
                <p className="text-sm text-gray-900 font-medium">{selectedOrder.sellerId}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.products.map((p, i) => (
                    <div key={i} className="flex justify-between items-start bg-gray-50 rounded-lg p-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {p.quantity}
                          {p.size ? ` · Size: ${p.size}` : ""}
                          {p.color ? ` · ${p.color}` : ""}
                        </p>
                      </div>
                      <p className="font-semibold">${(p.price * p.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                {[
                  ["Subtotal", `$${selectedOrder.subtotal.toFixed(2)}`],
                  ["Tax",      `$${selectedOrder.tax.toFixed(2)}`],
                  ["Shipping", selectedOrder.shipping === 0 ? "Free" : `$${selectedOrder.shipping.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-gray-600">
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
                  <span>Total</span><span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Timeline</p>
                <div className="relative">
                  {selectedOrder.statusHistory.map((entry: StatusHistoryEntry, idx: number) => {
                    const eCfg = STATUS_CFG[entry.status];
                    const isLast = idx === selectedOrder.statusHistory.length - 1;
                    return (
                      <div key={idx} className="flex gap-3 pb-4 relative">
                        {!isLast && (
                          <div className="absolute left-[13px] top-6 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10 ${eCfg.badge}`}>
                          {eCfg.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getStatusLabel(entry.status)}</p>
                          {entry.note && <p className="text-xs text-gray-500 italic">{entry.note}</p>}
                          <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual tracking notification note */}
              {selectedOrder.trackingNumber && selectedOrder.status === "shipped" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Tracking Notification</p>
                  <p className="text-sm text-blue-700">
                    Tracking ID: <span className="font-mono font-medium">{selectedOrder.trackingNumber}</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Check the courier's website and notify the customer manually.
                    Tracking number is visible to the customer in their order history.
                  </p>
                  {selectedOrder.handoverProof && (
                    <a
                      href={selectedOrder.handoverProof}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-700 underline hover:text-blue-900 mt-1 inline-block"
                    >
                      📎 View handover proof
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
