"use client";

import { Store, Heart, ExternalLink } from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import { User as UserType, users } from "@/data/users";

interface FollowedShopsProps {
  user: UserType;
}

export default function FollowedShops({ user }: FollowedShopsProps) {
  // Get shop details for followed shops
  const followedShopsData = user.followedShops?.map(shopId => {
    const seller = users.find(u => u.id === shopId && u.role === "seller");
    return seller ? {
      id: seller.id,
      name: seller.shopName || seller.name,
      description: seller.shopDescription || "No description available",
      profileImage: seller.profileImage,
      isVerified: seller.isVerified
    } : null;
  }).filter(Boolean) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Followed Shops</h3>
        <span className="text-sm text-gray-500">
          {followedShopsData.length} {followedShopsData.length === 1 ? 'shop' : 'shops'}
        </span>
      </div>
      
      {followedShopsData.length === 0 ? (
        <div className="text-center py-12">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Followed Shops</h4>
          <p className="text-gray-500 mb-4">Start following your favorite shops to see them here.</p>
          <ActionButton variant="secondary">
            Discover Shops
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-4">
          {followedShopsData.map((shop) => (
            <div key={shop?.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {/* Shop Image */}
                <div className="relative">
                  {shop?.profileImage ? (
                    <img
                      src={shop.profileImage}
                      alt={shop.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Store className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Verified Badge */}
                  {shop?.isVerified && (
                    <div className="absolute -bottom-1 -right-1">
                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* Shop Info */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{shop?.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{shop?.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}