"use client";
import { Button } from '@/ui/components/button';

export function DashboardOverview() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      changeType: 'increase' as const
    },
    {
      title: 'Active Sellers',
      value: '156',
      change: '+8%',
      changeType: 'increase' as const
    },
    {
      title: 'Total Products',
      value: '5,293',
      change: '+15%',
      changeType: 'increase' as const
    },
    {
      title: 'Revenue',
      value: '$84,532',
      change: '+23%',
      changeType: 'increase' as const
    }
  ];

  const recentActivities = [
    'New seller registration: John\'s Electronics Store',
    'User complaint resolved: Order #1234',
    'Product approved: Gaming Keyboard Pro',
    'Payment processed: $299.99',
    'New user registered: sarah@email.com'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
        </div>
        <Button variant="primary">
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-gray-700">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" fullWidth className="justify-start">
              🔍 Review Pending Sellers
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              📊 View Analytics Report
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              ⚡ Moderate Content
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              🎨 Update Site Settings
            </Button>
            <Button variant="outline" fullWidth className="justify-start">
              📧 Send Notifications
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}