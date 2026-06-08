"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, validateUser, getUserById } from "@/data/users";
import { getUserOverride, saveUserOverride } from "@/ui/components/seller-dashboard/seller-store";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUserId = localStorage.getItem("userId");
        if (savedUserId) {
          const foundUser = getUserById(savedUserId);
          if (foundUser) {
            const override = getUserOverride(savedUserId);
            setUser({ ...foundUser, ...override });
          } else {
            localStorage.removeItem("userId");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const validatedUser = validateUser(email, password);
      if (validatedUser) {
        const override = getUserOverride(validatedUser.id);
        setUser({ ...validatedUser, ...override });
        localStorage.setItem("userId", validatedUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  const updateUser = (partial: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    setUser(updated);
    saveUserOverride(user.id, partial as any);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
