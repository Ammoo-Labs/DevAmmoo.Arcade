"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  User,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";
import { getUsers, getAllOrders } from "@/lib/api/admin";
import { BackendAdminUser, BackendOrder } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/currency";

const STATUS_CFG: Record<string, { badge: string; icon: React.ReactNode }> = {
  pending:    { badge: "bg-yellow-100 text-yellow-800",  icon: <Clock className="w-3.5 h-3.5" /> },
  on_hold:    { badge: "bg-orange-100 text-orange-800",  icon: <PauseCircle className="w-3.5 h-3.5" /> },
  processing: { badge: "bg-blue-100 text-blue-800",      icon: <Package className="w-3.5 h-3.5" /> },
  packaged:   { badge: "bg-indigo-100 text-indigo-800",  icon: <Package className="w-3.5 h-3.5" /> },
  shipped:    { badge: "bg-purple-100 text-purple-800",  icon: <Truck className="w-3.5 h-3.5" /> },
  completed:  { badge: "bg-green-100 text-green-800",    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled:  { badge: "bg-red-100 text-red-800",        icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

function getStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface CustomerRow {
  id: string;
  name: string;
  joinDate: string;
  isVerified: boolean;
  accountStatus: string;
  orders: BackendOrder[];
}

export function CustomerManagement() {
  const { accessToken } = useAuth();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [customerUsers, allOrders] = await Promise.all([
          getUsers(accessToken, "customer"),
          getAllOrders(accessToken),
        ]);
        if (cancelled) return;

        const rows: CustomerRow[] = customerUsers.map((u: BackendAdminUser) => ({
          id: u.id,
          name: u.name,
          joinDate: u.createdAt,
          isVerified: u.isVerified,
          accountStatus: u.accountStatus,
          orders: allOrders.filter((o) => o.buyerId === u.id),
        }));

        setCustomers(rows);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load customers.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [accessToken]);

  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q);
  });

  const totalOrders = customers.reduce((s, c) => s + c.orders.length, 0);
  const totalSpend = customers.reduce(
    (s, c) => s + c.orders.filter((o) => o.status === "completed").reduce((os, o) => os + Number(o.total), 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600 mt-1">View customer profiles, order history, and activity</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length, color: "text-gray-900" },
          { label: "Total Orders",    value: totalOrders,       color: "text-blue-700" },
          { label: "Total Revenue",   value: formatCurrency(totalSpend), color: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Customer list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(c.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{c.orders.length}</td>
                  <td className="px-4 py-3">
                    {c.isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedCustomer(c);
                      setExpandedOrder(null);
                    }}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No customers found.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>

      {/* ── Customer Detail Modal ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Customer Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h4>
                  {selectedCustomer.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-sm">
                {[
                  ["Account Status", selectedCustomer.accountStatus],
                  ["Joined",   new Date(selectedCustomer.joinDate).toLocaleDateString()],
                  ["Orders",   String(selectedCustomer.orders.length)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-gray-900 font-medium capitalize">{v}</span>
                  </div>
                ))}
              </div>

              {/* Order history */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Order History</h4>
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No orders placed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order) => {
                      const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
                      const isOpen = expandedOrder === order.id;
                      return (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                            onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-gray-500">{order.orderNumber}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                                {cfg.icon}
                                {getStatusLabel(order.status)}
                              </span>
                              {order.trackingNumber && (
                                <span className="text-xs text-gray-400 font-mono">📦 {order.trackingNumber}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</span>
                              {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                            </div>
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 space-y-3 pt-3">
                              <p className="text-xs text-gray-500">Ordered: {new Date(order.orderDate).toLocaleString()}</p>
                              <p className="text-xs text-gray-500">📍 {order.shippingAddress}</p>
                              {order.items.map((p) => (
                                <div key={p.id} className="flex justify-between text-sm bg-white rounded p-2 border border-gray-200">
                                  <span className="text-gray-700">{p.quantity}× {p.name}</span>
                                  <span className="font-medium">{formatCurrency(Number(p.price) * p.quantity)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
