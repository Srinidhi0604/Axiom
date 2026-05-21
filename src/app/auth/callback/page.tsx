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

function userFromSupabaseSession(session: {
  access_token: string;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    app_metadata?: Record<string, unknown>;
  };
}) {
  const email = session.user.email || "";
  const name =
    typeof session.user.user_metadata?.full_name === "string"
      ? session.user.user_metadata.full_name
      : typeof session.user.user_metadata?.name === "string"
        ? session.user.user_metadata.name
        : email.split("@")[0] || "axiom_user";
  const username = `${String(name).toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "")}_${session.user.id.slice(-6)}`;
  const avatarUrl =
    typeof session.user.user_metadata?.avatar_url === "string"
      ? session.user.user_metadata.avatar_url
      : typeof session.user.user_metadata?.picture === "string"
        ? session.user.user_metadata.picture
        : "";

  return {
    id: session.user.id,
    username,
    email,
    avatarUrl,
    authProvider: session.user.app_metadata?.provider === "google" ? "google" : "supabase",
  };
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

      if (!accessToken || !data.session) {
        router.replace("/auth/login?error=oauth_failed");
        return;
      }

      persistAppAuth(userFromSupabaseSession(data.session), accessToken);

      fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ accessToken }),
      })
        .then(async (syncResponse) => {
          if (!syncResponse.ok) return;
          const synced = await syncResponse.json();
          if (synced?.user && synced?.token) {
            persistAppAuth(synced.user, synced.token);
          }
        })
        .catch(() => {});

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
