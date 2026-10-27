"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { storeGoogleToken } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (session?.provider_refresh_token && session.user?.id) {
        syncTokenToBackend(session.user.id, session.provider_refresh_token, session.provider_token);
      }
    });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);

      if (event === "SIGNED_IN" && newSession && newSession.provider_refresh_token) {
        await syncTokenToBackend(
          newSession.user.id,
          newSession.provider_refresh_token,
          newSession.provider_token
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncTokenToBackend = async (
    userId: string,
    refreshToken: string,
    accessToken?: string | null
  ) => {
    try {
      console.log("Syncing Google OAuth token with Taya backend...");
      await storeGoogleToken({
        userId,
        providerRefreshToken: refreshToken,
        providerAccessToken: accessToken || undefined,
      });
      console.log("Successfully linked Google tokens & started Gmail inbox watch.");
    } catch (err) {
      console.error("Failed to link tokens to backend:", err);
    }
  };

  const signInWithGoogle = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        scopes: "email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.modify",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
