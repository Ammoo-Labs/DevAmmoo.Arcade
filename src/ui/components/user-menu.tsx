"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, Store, ShieldCheck } from "lucide-react";
import { ActionButton } from "@/ui/components/button";
import { useAuth } from "@/ui/components/auth/auth-context";

interface UserMenuProps {
  buttonText?: string;
  buttonClassName?: string;
}

export default function UserMenu({ buttonText = "Welcome" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const displayName = isAuthenticated && user ? user.name.split(" ")[0] : buttonText;

  return (
    <div className="relative" ref={menuRef}>
      <ActionButton
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
        size="sm"
        className="flex items-center gap-1"
      >
        {displayName}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </ActionButton>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {isAuthenticated && user ? (
            <div className="py-1 sm:py-2">
              {/* User info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </div>

              <Link
                href={user.role === "admin" ? "/admin" : user.role === "seller" ? "/seller" : "/profile"}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 w-full text-left px-4 py-2.5 sm:py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                {user.role === "admin" ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : user.role === "seller" ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {user.role === "admin" ? "Admin Dashboard" : user.role === "seller" ? "Seller Dashboard" : "My Profile"}
              </Link>

              <hr className="my-1 border-gray-200" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2.5 sm:py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-1 sm:py-2">
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2.5 sm:py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                Register
              </Link>
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2.5 sm:py-2 text-sm hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <hr className="my-1 border-gray-200" />
              <Link
                href="/switch-to-selling"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2.5 sm:py-2 text-sm text-blue-600 font-medium hover:bg-gray-100 transition-colors"
              >
                Switch to Selling
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
