"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthUser {
  id?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  authProvider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function persistAppAuth(user: AuthUser, token: string) {
  localStorage.setItem("axiom_user", JSON.stringify(user));
  localStorage.setItem("axiom_token", token);
  localStorage.setItem("pullgame_user", JSON.stringify(user));
  localStorage.setItem("pullgame_token", token);
}

function clearAppAuth() {
  localStorage.removeItem("axiom_user");
  localStorage.removeItem("axiom_token");
  localStorage.removeItem("pullgame_user");
  localStorage.removeItem("pullgame_token");
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSupabaseSession = async () => {
      const supabase = getSupabaseBrowserClient();
      const stored = localStorage.getItem("axiom_user") || localStorage.getItem("pullgame_user");

      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          clearAppAuth();
        }
      }

      if (!supabase) {
        try {
          const token = localStorage.getItem("axiom_token") || localStorage.getItem("pullgame_token");
          const response = await fetch("/api/auth/me", {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            credentials: "include",
          });
          const data = await response.json();
          if (active && data.user) {
            setUser(data.user);
            localStorage.setItem("axiom_user", JSON.stringify(data.user));
          }
        } finally {
          if (active) setIsLoading(false);
        }
        return;
      }

      const hydrateFromSession = async () => {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.access_token;

        if (!accessToken) {
          clearAppAuth();
          if (active) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) {
          clearAppAuth();
          if (active) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        const synced = await response.json();
        if (active) {
          setUser(synced.user);
          persistAppAuth(synced.user, synced.token);
          setIsLoading(false);
        }
      };

      await hydrateFromSession();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          clearAppAuth();
          setUser(null);
          return;
        }

        const accessToken = session?.access_token;
        if (!accessToken) return;

        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ accessToken }),
        });

        if (!response.ok) return;

        const synced = await response.json();
        setUser(synced.user);
        persistAppAuth(synced.user, synced.token);
      });

      return () => subscription.unsubscribe();
    };

    const cleanupPromise = syncSupabaseSession();

    return () => {
      active = false;
      Promise.resolve(cleanupPromise).then((cleanup) => cleanup?.());
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session?.access_token) return false;

      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        credentials: "include",
        body: JSON.stringify({ accessToken: data.session.access_token }),
      });

      if (!response.ok) return false;
      const synced = await response.json();
      setUser(synced.user);
      persistAppAuth(synced.user, synced.token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
          },
        },
      });

      if (error) return false;
      const accessToken = data.session?.access_token;
      if (!accessToken) {
        return true;
      }

      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) return false;
      const synced = await response.json();
      setUser(synced.user);
      persistAppAuth(synced.user, synced.token);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      return false;
    }

    if (data.url) {
      window.location.href = data.url;
      return true;
    }

    return false;
  };

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    setUser(null);
    clearAppAuth();
    if (supabase) {
      await supabase.auth.signOut();
    }
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
