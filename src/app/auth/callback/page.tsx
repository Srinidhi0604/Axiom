"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function persistAppAuth(user: unknown, token: string) {
  localStorage.setItem("axiom_user", JSON.stringify(user));
  localStorage.setItem("axiom_token", token);
  localStorage.setItem("pullgame_user", JSON.stringify(user));
  localStorage.setItem("pullgame_token", token);
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const finishAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.replace("/auth/login?error=google_unavailable");
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/auth/login?error=${encodeURIComponent(error.message || "oauth_failed")}`);
          return;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        router.replace(`/auth/login?error=${encodeURIComponent(sessionError.message || "oauth_failed")}`);
        return;
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        router.replace("/auth/login?error=oauth_failed");
        return;
      }

      const syncResponse = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ accessToken }),
      });

      if (!syncResponse.ok) {
        const errorData = await syncResponse.json().catch(() => ({}));
        const message = errorData?.details || errorData?.error || "oauth_failed";
        router.replace(`/auth/login?error=${encodeURIComponent(message)}`);
        return;
      }

      const synced = await syncResponse.json();
      if (synced?.user && synced?.token) {
        persistAppAuth(synced.user, synced.token);
      }

      if (!cancelled) {
        router.replace("/");
      }
    };

    finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
      Finishing sign in...
    </div>
  );
}
