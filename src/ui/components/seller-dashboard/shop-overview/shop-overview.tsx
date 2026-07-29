"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Eye,
  Star,
  Calendar,
  BarChart3,
  Package,
} from "lucide-react";
import { useAuth } from "@/ui/components/auth/auth-context";
import { getSellerOrders } from "@/lib/api/orders";
import { getMyProducts } from "@/lib/api/products";
import { getWallet } from "@/lib/api/payouts";
import { BackendOrder, BackendProduct, BackendWallet } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/currency";

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed": return "bg-green-100 text-green-800";
    case "shipped": return "bg-blue-100 text-blue-800";
    case "packaged":
    case "processing": return "bg-yellow-100 text-yellow-800";
    case "on_hold": return "bg-orange-100 text-orange-800";
    case "cancelled": return "bg-red-100 text-red-800";
    case "pending": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export default function ShopOverview() {
  const { accessToken } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [wallet, setWallet] = useState<BackendWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const [ordersData, productsData, walletData] = await Promise.all([
          getSellerOrders(accessToken),
          getMyProducts(accessToken),
          getWallet(accessToken),
        ]);
        if (cancelled) return;
        setOrders(ordersData);
        setProducts(productsData);
        setWallet(walletData);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Failed to load dashboard data.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [accessToken]);

  const totalRevenue = wallet ? wallet.total : 0;
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const reviewedProducts = products.filter((p) => p.reviewCount > 0);
  const avgRating = reviewedProducts.length
    ? reviewedProducts.reduce((sum, p) => sum + Number(p.rating), 0) / reviewedProducts.length
    : 0;

  const statsData: StatCard[] = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { title: "Total Orders", value: String(totalOrders), icon: ShoppingBag },
    { title: "Total Products", value: String(totalProducts), icon: Eye },
    { title: "Customer Rating", value: avgRating ? avgRating.toFixed(1) : "—", icon: Star },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 4);

  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4)
    .map((p) => ({
      name: p.name,
      sales: p.sales,
      revenue: p.sales * Number(p.price),
    }));

  const maxSales = Math.max(1, ...topProducts.map((p) => p.sales));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Overview</h1>
          <p className="text-gray-600">Monitor your shop&apos;s performance and analytics</p>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
      <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 font-mono text-sm">{order.orderNumber}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {order.items[0]?.name}
                      {order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-black h-2 rounded-full"
                        style={{ width: `${(product.sales / maxSales) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Sales chart will be displayed here</p>
            <p className="text-sm text-gray-400">Integration with charting library needed</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
