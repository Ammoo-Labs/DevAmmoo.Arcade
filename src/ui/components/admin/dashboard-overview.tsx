"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/ui/components/auth/auth-context';
import { getAdminStats, getAllOrders, getAdminProducts, getAdminShops } from '@/lib/api/admin';
import { BackendAdminStats } from '@/lib/api/types';
import { ApiError } from '@/lib/api/client';

interface ActivityItem {
  id: string;
  text: string;
  createdAt: string;
}

export function DashboardOverview() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<BackendAdminStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [statsRes, orders, products, shops] = await Promise.all([
          getAdminStats(accessToken),
          getAllOrders(accessToken),
          getAdminProducts(accessToken),
          getAdminShops(accessToken),
        ]);
        if (cancelled) return;

        const recent: ActivityItem[] = [
          ...orders.map((o) => ({
            id: `order-${o.id}`,
            text: `New order ${o.id} from ${o.customerName} — $${Number(o.total).toFixed(2)}`,
            createdAt: o.createdAt,
          })),
          ...products.map((p) => ({
            id: `product-${p.id}`,
            text: `Product submitted: ${p.name}`,
            createdAt: p.createdAt,
          })),
          ...shops.map((s) => ({
            id: `shop-${s.id}`,
            text: `New seller registration: ${s.shopName}`,
            createdAt: s.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats(statsRes);
        setActivities(recent);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load dashboard data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [accessToken]);

  const statCards = stats
    ? [
        { title: 'Total Users', value: stats.users.total.toLocaleString() },
        { title: 'Active Sellers', value: stats.users.sellers.toLocaleString() },
        { title: 'Pending Products', value: stats.products.pendingApproval.toLocaleString() },
        { title: 'Revenue', value: `$${stats.revenue.total.toLocaleString()}` },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div key={stat.title} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent activity.</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{activity.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Review</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Products awaiting approval</span>
                  <span className="font-semibold text-gray-900">{stats?.products.pendingApproval ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Shops awaiting approval</span>
                  <span className="font-semibold text-gray-900">{stats?.shops.pendingApproval ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Orders pending</span>
                  <span className="font-semibold text-gray-900">{stats?.orders.pending ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total customers</span>
                  <span className="font-semibold text-gray-900">{stats?.users.customers ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
