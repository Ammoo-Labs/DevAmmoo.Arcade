"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Package
} from "lucide-react";
import { ActionButton, IconButton } from "@/ui/components/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  image: string;
  sales: number;
  createdAt: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Vintage Leather Jacket",
    category: "Fashion",
    price: 299.99,
    stock: 15,
    status: "active",
    image: "/api/placeholder/80/80",
    sales: 45,
    createdAt: "2024-09-15"
  },
  {
    id: 2,
    name: "Minimalist Watch",
    category: "Accessories",
    price: 159.99,
    stock: 8,
    status: "active",
    image: "/api/placeholder/80/80",
    sales: 32,
    createdAt: "2024-09-10"
  },
  {
    id: 3,
    name: "Handcrafted Necklace",
    category: "Jewelry",
    price: 79.99,
    stock: 0,
    status: "inactive",
    image: "/api/placeholder/80/80",
    sales: 18,
    createdAt: "2024-09-05"
  },
  {
    id: 4,
    name: "Designer Sneakers",
    category: "Footwear",
    price: 199.99,
    stock: 22,
    status: "active",
    image: "/api/placeholder/80/80",
    sales: 38,
    createdAt: "2024-08-28"
  },
  {
    id: 5,
    name: "Ceramic Vase Set",
    category: "Home Decor",
    price: 129.99,
    stock: 5,
    status: "draft",
    image: "/api/placeholder/80/80",
    sales: 0,
    createdAt: "2024-10-01"
  }
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (stock <= 5) return { label: "Low Stock", color: "text-yellow-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = (id: number, newStatus: "active" | "inactive" | "draft") => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <ActionButton onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
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
                placeholder="Search products..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.category}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">${product.price}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.stock}</p>
                        <p className={`text-sm ${stockStatus.color}`}>{stockStatus.label}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(product.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{product.sales}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <IconButton
                          icon="custom"
                          customIcon={<Eye className="w-4 h-4" />}
                          variant="ghost"
                          size="sm"
                          title="View Product"
                        />
                        <IconButton
                          icon="custom"
                          customIcon={<Edit className="w-4 h-4" />}
                          variant="ghost"
                          size="sm"
                          title="Edit Product"
                        />
                        <IconButton
                          icon="custom"
                          customIcon={<Trash2 className="w-4 h-4" />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Product"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Product Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <p className="text-gray-600 mb-4">Product creation form would go here</p>
            <div className="flex justify-end space-x-3">
              <ActionButton variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton onClick={() => setShowAddModal(false)}>
                Create Product
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}