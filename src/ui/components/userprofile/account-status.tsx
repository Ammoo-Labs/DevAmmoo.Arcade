"use client";

import { Heart, ShoppingBag, Calendar, Star } from "lucide-react";
import { User as UserType } from "@/data/users";

interface AccountStatusProps {
  user: UserType;
}

export default function AccountStatus({ user }: AccountStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Status</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Wishlist</p>
              <p className="text-sm text-gray-500">Saved items</p>
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {user.wishlist?.length || 0}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Orders</p>
              <p className="text-sm text-gray-500">Total purchases</p>
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">0</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Member Since</p>
              <p className="text-sm text-gray-500">Account created</p>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-900">
            {user.createdAt}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Followed Shops</p>
              <p className="text-sm text-gray-500">Favorite stores</p>
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">
            {user.followedShops?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}