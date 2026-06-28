"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/ui/components/admin/admin-sidebar';
import { DashboardOverview } from '@/ui/components/admin/dashboard-overview';
import { UserManagement } from '@/ui/components/admin/user-management';
import { SellerManagement } from '@/ui/components/admin/seller-management';
import { PostManagement } from '@/ui/components/admin/post-management';
import { OrderManagement } from '@/ui/components/admin/order-management';
import { CustomerManagement } from '@/ui/components/admin/customer-management';
import { CustomizeWebsite } from '@/ui/components/admin/customize-website';
import { useAuth } from '@/ui/components/auth/auth-context';

type AdminSection = 'dashboard' | 'users' | 'sellers' | 'posts' | 'orders' | 'customers' | 'customize';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.push('/signin'); return; }
    if (user?.role !== 'admin') router.push('/');
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':  return <DashboardOverview />;
      case 'users':      return <UserManagement />;
      case 'sellers':    return <SellerManagement />;
      case 'posts':      return <PostManagement />;
      case 'orders':     return <OrderManagement />;
      case 'customers':  return <CustomerManagement />;
      case 'customize':  return <CustomizeWebsite />;
      default:           return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
