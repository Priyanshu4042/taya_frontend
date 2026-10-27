"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { storeGoogleToken } from "@/lib/api";
import { Sparkles, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Finalizing authentication...");

  useEffect(() => {
    async function handleAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          if (session.provider_refresh_token && session.user?.id) {
            setStatus("Syncing Google tokens & inbox hooks with backend...");
            try {
              await storeGoogleToken({
                userId: session.user.id,
                providerRefreshToken: session.provider_refresh_token,
                providerAccessToken: session.provider_token || undefined,
              });
            } catch (syncErr) {
              console.warn("Backend token registration error:", syncErr);
            }
          }
          setStatus("Redirecting to dashboard...");
          router.replace("/");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        router.replace("/login");
      }
    }

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center border border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Connecting to Taya</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">{status}</p>
        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      </div>
    </div>
  );
}
