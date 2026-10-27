"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-context";
import { 
  CheckSquare, 
  MessageSquareText, 
  CalendarDays, 
  LogOut, 
  Sparkles,
  User,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      label: "Items & Reminders",
      href: "/",
      icon: CheckSquare,
    },
    {
      label: "Message Ingest",
      href: "/ingest",
      icon: MessageSquareText,
    },
    {
      label: "Calendar Sync",
      href: "/calendar",
      icon: CalendarDays,
    },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  Taya
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    AI
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 -mt-1 hidden sm:inline">
                  Your life-admin, sorted.
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right section: Backend status + User */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[12px] font-medium text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              <span>Backend Connected</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 bg-slate-950/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors",
                isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
