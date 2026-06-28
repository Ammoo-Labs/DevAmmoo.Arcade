"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getMe, updateMe, uploadAvatar as apiUploadAvatar } from "@/lib/api/auth";
import { BackendProfile } from "@/lib/api/types";

interface AuthContextType {
  user: BackendProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<{ profile: BackendProfile | null; error?: string }>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error?: string }>;
  updateUser: (partial: Partial<Pick<BackendProfile, "name" | "phone" | "address" | "city" | "postalCode" | "profileImage">>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (session: Session): Promise<BackendProfile | null> => {
    setAccessToken(session.access_token);
    try {
      const profile = await getMe(session.access_token);
      // Inject email from Supabase session (not stored in Profile table)
      const fullProfile = { ...profile, email: session.user.email ?? "" };
      setUser(fullProfile);
      return fullProfile;
    } catch {
      // Backend is unreachable or returned an error.
      // Build a minimal profile from the Supabase session so the UI always
      // reflects the real auth state (shows user name, not "Welcome").
      // Full profile data will load on the next successful getMe call.
      setUser((prev) => {
        if (prev) return prev; // Already have a profile — keep it
        const meta = session.user.user_metadata ?? {};
        return {
          id: session.user.id,
          email: session.user.email ?? "",
          name: (meta.name as string) ?? (meta.full_name as string) ?? session.user.email?.split("@")[0] ?? "User",
          role: "customer",
          accountStatus: "active",
          isVerified: !!session.user.email_confirmed_at,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at ?? session.user.created_at,
          shop: null,
        } satisfies BackendProfile;
      });
      return null;
    }
  }, []);

  useEffect(() => {
    // Load session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadProfile(session).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await loadProfile(session);
        } else {
          setUser(null);
          setAccessToken(null);
        }
        setIsLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = async (email: string, password: string): Promise<{ profile: BackendProfile | null; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { profile: null, error: error.message };
    if (!data.session) return { profile: null, error: 'Authentication failed. Please try again.' };
    // Auth succeeded — backend profile load failure is a separate issue, not wrong credentials
    const profile = await loadProfile(data.session);
    return { profile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    return {};
  };

  const updateUser = async (
    partial: Partial<Pick<BackendProfile, "name" | "phone" | "address" | "city" | "postalCode" | "profileImage">>,
  ) => {
    if (!accessToken) return;
    const updated = await updateMe(accessToken, partial);
    setUser((prev) => prev ? { ...prev, ...updated } : null);
  };

  const uploadAvatar = async (file: File) => {
    // Always get the freshest token — state may lag behind a Supabase auto-refresh
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? accessToken;
    if (!token) return;
    if (session?.access_token) setAccessToken(session.access_token);
    const updated = await apiUploadAvatar(token, file);
    setUser((prev) => prev ? { ...prev, ...updated } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        accessToken,
        login,
        logout,
        signup,
        updateUser,
        uploadAvatar,
      }}
    >
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
