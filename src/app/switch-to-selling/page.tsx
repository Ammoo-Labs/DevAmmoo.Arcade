"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShopWizard from "@/ui/components/shop-wizard/shop-wizard";
import { useAuth } from "@/ui/components/auth/auth-context";
import { elevateToSeller } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function SwitchToSellingPage() {
  const { user, accessToken, isAuthenticated, isLoading, sellerStatus } = useAuth();
  const router = useRouter();
  const [isElevating, setIsElevating] = useState(true);
  const [elevateError, setElevateError] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }
    if (user?.role === "admin") {
      router.push("/");
      return;
    }
    if (user?.role === "seller") {
      if (sellerStatus?.hasShop) {
        // Onboarding already complete — nothing to resume, go straight to the dashboard.
        router.push("/seller");
        return;
      }
      // Already a seller but the shop wizard wasn't finished — resume it, nothing to elevate.
      setIsElevating(false);
      return;
    }
    if (!accessToken) return;

    elevateToSeller(accessToken)
      .then(() => {
        // The auth context only fetches the profile/role once on mount; force a
        // reload so AuthProvider re-fetches /auth/me and picks up role=seller
        // (needed so /seller's role-guard doesn't bounce the user afterwards).
        window.location.reload();
      })
      .catch((err) => {
        setElevateError(err instanceof ApiError ? err.message : "Failed to start seller onboarding. Please try again.");
        setIsElevating(false);
      });
  }, [isLoading, isAuthenticated, user, accessToken, sellerStatus, router]);

  if (isLoading || !isAuthenticated || isElevating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (elevateError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-xl shadow-sm p-8 max-w-md text-center space-y-3">
          <p className="text-red-700 font-medium">{elevateError}</p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <ShopWizard />;
}
