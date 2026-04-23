"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Eye,
  Star,
  Calendar,
  BarChart3
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}

const statsData: StatCard[] = [
  {
    title: "Total Revenue",
    value: "$12,345",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Total Orders",
    value: "234",
    change: "+8.3%",
    trend: "up",
    icon: ShoppingBag
  },
  {
    title: "Total Products",
    value: "42",
    change: "+3.2%",
    trend: "up",
    icon: Eye
  },
  {
    title: "Customer Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star
  }
];

const recentOrders = [
  { id: "#ORD-001", customer: "Alice Johnson", product: "Vintage Leather Jacket", amount: "$299.99", status: "Delivered", date: "2024-10-07" },
  { id: "#ORD-002", customer: "Bob Smith", product: "Minimalist Watch", amount: "$159.99", status: "Shipped", date: "2024-10-07" },
  { id: "#ORD-003", customer: "Carol Davis", product: "Handcrafted Necklace", amount: "$79.99", status: "Processing", date: "2024-10-06" },
  { id: "#ORD-004", customer: "David Wilson", product: "Designer Sneakers", amount: "$199.99", status: "Pending", date: "2024-10-06" },
];

const topProducts = [
  { name: "Vintage Leather Jacket", sales: 45, revenue: "$13,495.55" },
  { name: "Designer Sneakers", sales: 38, revenue: "$7,599.62" },
  { name: "Minimalist Watch", sales: 32, revenue: "$5,119.68" },
  { name: "Streetwear Hoodie", sales: 28, revenue: "$2,519.72" },
];

export default function ShopOverview() {
  const [timeRange, setTimeRange] = useState("7d");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Overview</h1>
          <p className="text-gray-600">Monitor your shop's performance and analytics</p>
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
              <div className="flex items-center mt-4">
                <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
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
            <button className="text-sm text-black hover:underline">View all</button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ width: `${(product.sales / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}