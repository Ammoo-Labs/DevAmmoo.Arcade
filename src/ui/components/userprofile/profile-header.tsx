"use client";

import Link from "next/link";
import { User, CheckCircle, XCircle } from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import { User as UserType } from "@/data/users";

interface ProfileHeaderProps {
  user: UserType;
  onLogout: () => void;
}

export default function ProfileHeader({ user, onLogout }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-gray-100">
                <User className="w-10 h-10 text-gray-600" />
              </div>
            )}
            
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1">
              {user.isVerified ? (
                <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-gray-600 capitalize mb-2">{user.role} Account</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.isVerified 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {user.isVerified ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified Account
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  Unverified Account
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <ActionButton variant="secondary">
              Back to Shop
            </ActionButton>
          </Link>
          <ActionButton onClick={onLogout} variant="secondary">
            Logout
          </ActionButton>
        </div>
      </div>
    </div>
  );
}