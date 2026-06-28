"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/ui/components/button';
import { useAuth } from '@/ui/components/auth/auth-context';
import { getUsers, updateUserStatus, assignUserRole } from '@/lib/api/admin';
import { BackendAdminUser } from '@/lib/api/types';
import { ApiError } from '@/lib/api/client';

type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended' | 'banned';
type RoleFilter = 'all' | 'customer' | 'seller' | 'admin';

export function UserManagement() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<BackendAdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterRole, setFilterRole] = useState<RoleFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const reload = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getUsers(accessToken, filterRole === 'all' ? undefined : filterRole);
      setUsers(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, filterRole]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.accountStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-amber-100 text-amber-800',
      banned: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'suspended' | 'banned') => {
    if (!accessToken) return;
    setProcessingId(id);
    setError('');
    try {
      const updated = await updateUserStatus(accessToken, id, status);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update user status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (id: string, role: 'customer' | 'seller' | 'admin') => {
    if (!accessToken) return;
    setProcessingId(id);
    setError('');
    try {
      const updated = await assignUserRole(accessToken, id, role);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update user role.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all users and their accounts</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as RoleFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="seller">Sellers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.accountStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {user.accountStatus !== 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-800"
                        disabled={processingId === user.id}
                        onClick={() => handleStatusChange(user.id, 'active')}
                      >
                        Activate
                      </Button>
                    )}
                    {user.accountStatus !== 'suspended' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-800"
                        disabled={processingId === user.id}
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                      >
                        Suspend
                      </Button>
                    )}
                    {user.accountStatus !== 'banned' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        disabled={processingId === user.id}
                        onClick={() => handleStatusChange(user.id, 'banned')}
                      >
                        Ban
                      </Button>
                    )}
                    {user.role !== 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={processingId === user.id}
                        onClick={() => handleRoleChange(user.id, user.role === 'seller' ? 'customer' : 'seller')}
                      >
                        Make {user.role === 'seller' ? 'Customer' : 'Seller'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No users match your filter.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {users.filter(u => u.accountStatus === 'active').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Suspended / Banned</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {users.filter(u => u.accountStatus === 'suspended' || u.accountStatus === 'banned').length}
          </p>
        </div>
      </div>
    </div>
  );
}
