"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { Sparkles, Calendar, Mail, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    router.replace("/");
    return null;
  }

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to initiate Google Sign-in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl shadow-black/80">
          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-5 glow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Taya
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Your autonomous life-admin, completely sorted.
            </p>
          </div>

          {/* Feature badges */}
          <div className="my-8 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real-time Gmail inbox monitoring for bills & dues</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Automatic deadline creation in Google Calendar</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI deduplication & zero promotional spam guarantee</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {/* Google Sign-in button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center mt-5">
            By signing in, you grant Taya permission to read incoming admin notifications and sync events to your Google Calendar.
          </p>
        </div>
      </div>
    </div>
  );
}
