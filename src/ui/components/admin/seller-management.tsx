"use client";
import { useState } from 'react';
import { Button } from '@/ui/components/button';

interface Seller {
  id: string;
  name: string;
  shopName: string;
  email: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  joinDate: string;
  products: number;
  revenue: number;
}

export function SellerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');

  const sellers: Seller[] = [
    {
      id: '1',
      name: 'John Electronics',
      shopName: 'John\'s Tech Store',
      email: 'john@techstore.com',
      status: 'active',
      joinDate: '2024-01-15',
      products: 45,
      revenue: 12580
    },
    {
      id: '2',
      name: 'Sarah Fashion',
      shopName: 'Sarah\'s Boutique',
      email: 'sarah@boutique.com',
      status: 'pending',
      joinDate: '2024-10-20',
      products: 0,
      revenue: 0
    },
    {
      id: '3',
      name: 'Mike Gaming',
      shopName: 'Gaming Paradise',
      email: 'mike@gaming.com',
      status: 'active',
      joinDate: '2024-02-10',
      products: 28,
      revenue: 8950
    }
  ];

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || seller.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Seller['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSellerAction = (sellerId: string, action: 'approve' | 'reject' | 'suspend' | 'activate') => {
    // Handle seller actions here
    console.log(`Action: ${action} for seller: ${sellerId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600 mt-1">Manage sellers and their shops</p>
        </div>
        <Button variant="primary">
          Export Sellers
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sellers by name, shop, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {sellers.filter(s => s.status === 'pending').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Pending Approvals ({sellers.filter(s => s.status === 'pending').length})
          </h3>
          <p className="text-yellow-700">You have sellers waiting for approval.</p>
        </div>
      )}

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{seller.shopName}</div>
                      <div className="text-sm text-gray-500">{seller.name}</div>
                      <div className="text-sm text-gray-500">{seller.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(seller.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(seller.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.products}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${seller.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    {seller.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleSellerAction(seller.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleSellerAction(seller.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {seller.status === 'active' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleSellerAction(seller.id, 'suspend')}
                      >
                        Suspend
                      </Button>
                    )}
                    {seller.status === 'suspended' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSellerAction(seller.id, 'activate')}
                      >
                        Activate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Sellers</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">156</p>
          <p className="text-sm text-gray-500 mt-1">+8% from last month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Sellers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">142</p>
          <p className="text-sm text-gray-500 mt-1">91% of total sellers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">$84,532</p>
          <p className="text-sm text-gray-500 mt-1">+23% from last month</p>
        </div>
      </div>
    </div>
  );
}