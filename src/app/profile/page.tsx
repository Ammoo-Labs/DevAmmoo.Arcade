"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/ui/components/auth/auth-context";
import { 
  ProfileHeader, 
  AccountStatus, 
  FollowedShops, 
  QuickActions 
} from "@/ui/components/userprofile";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-40 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader user={user} onLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Status */}
          <AccountStatus user={user} />

          {/* Followed Shops */}
          <FollowedShops user={user} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <QuickActions userRole={user.role} />
        </div>
      </div>
    </div>
  );
}