"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { ActionButton, IconButton } from "@/ui/components/button";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  products: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  orderDate: string;
  shippingAddress: string;
}

const sampleOrders: Order[] = [
  {
    id: "#ORD-001",
    customer: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/api/placeholder/40/40"
    },
    products: [
      {
        name: "Vintage Leather Jacket",
        image: "/api/placeholder/60/60",
        quantity: 1,
        price: 299.99
      }
    ],
    total: 299.99,
    status: "delivered",
    paymentStatus: "paid",
    orderDate: "2024-10-07",
    shippingAddress: "123 Main St, New York, NY 10001"
  },
  {
    id: "#ORD-002",
    customer: {
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "/api/placeholder/40/40"
    },
    products: [
      {
        name: "Minimalist Watch",
        image: "/api/placeholder/60/60",
        quantity: 1,
        price: 159.99
      }
    ],
    total: 159.99,
    status: "shipped",
    paymentStatus: "paid",
    orderDate: "2024-10-07",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210"
  },
  {
    id: "#ORD-003",
    customer: {
      name: "Carol Davis",
      email: "carol@example.com",
      avatar: "/api/placeholder/40/40"
    },
    products: [
      {
        name: "Handcrafted Necklace",
        image: "/api/placeholder/60/60",
        quantity: 2,
        price: 79.99
      }
    ],
    total: 159.98,
    status: "processing",
    paymentStatus: "paid",
    orderDate: "2024-10-06",
    shippingAddress: "789 Pine St, Chicago, IL 60601"
  },
  {
    id: "#ORD-004",
    customer: {
      name: "David Wilson",
      email: "david@example.com",
      avatar: "/api/placeholder/40/40"
    },
    products: [
      {
        name: "Designer Sneakers",
        image: "/api/placeholder/60/60",
        quantity: 1,
        price: 199.99
      }
    ],
    total: 199.99,
    status: "pending",
    paymentStatus: "pending",
    orderDate: "2024-10-06",
    shippingAddress: "321 Elm St, Miami, FL 33101"
  },
  {
    id: "#ORD-005",
    customer: {
      name: "Eva Brown",
      email: "eva@example.com",
      avatar: "/api/placeholder/40/40"
    },
    products: [
      {
        name: "Ceramic Vase Set",
        image: "/api/placeholder/60/60",
        quantity: 1,
        price: 129.99
      }
    ],
    total: 129.99,
    status: "cancelled",
    paymentStatus: "failed",
    orderDate: "2024-10-05",
    shippingAddress: "654 Maple Dr, Seattle, WA 98101"
  }
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "processing": return <Package className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track your orders</p>
        </div>
        <ActionButton className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </ActionButton>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{order.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                        <Image
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {order.products.slice(0, 2).map((product, index) => (
                        <div key={index} className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.products.length > 2 && (
                        <span className="text-sm text-gray-500">+{order.products.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">${order.total}</td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order["status"])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.orderDate}</td>
                  <td className="py-4 px-4">
                    <IconButton
                      icon="custom"
                      customIcon={<Eye className="w-4 h-4" />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      title="View Order Details"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-gray-900">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-gray-900">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-600 mt-2">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Products</h4>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">${product.price * product.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-900">Total</p>
                    <p className="text-lg font-semibold text-gray-900">${selectedOrder.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}