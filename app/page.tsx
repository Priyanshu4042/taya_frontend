"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth-context";
import { fetchItems } from "@/lib/api";
import { Item } from "@/lib/types";
import { ItemCard } from "@/components/item-card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { 
  RefreshCw, 
  Search, 
  Sparkles, 
  Receipt, 
  Tv, 
  CreditCard, 
  Plane, 
  PlusCircle, 
  AlertCircle,
  Inbox,
  CalendarCheck2,
  TrendingUp,
  LogIn
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Load items when user is ready
  const loadData = async (userId: string, isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await fetchItems(userId);
      setItems(data);
    } catch (err: unknown) {
      console.error(err);
      setError("Unable to load items. Verify backend connectivity.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user?.id) {
        loadData(user.id);
      } else {
        // Not logged in
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  // Filter & Search computations
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (selectedType !== "all") {
        if (!item.type.toLowerCase().includes(selectedType.toLowerCase())) {
          return false;
        }
      }
      // Status filter
      if (selectedStatus !== "all") {
        if (item.status.toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const billerMatch = item.biller_name?.toLowerCase().includes(q);
        const snippetMatch = item.raw_snippet?.toLowerCase().includes(q);
        if (!titleMatch && !billerMatch && !snippetMatch) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedType, selectedStatus, searchQuery]);

  // Statistics
  const totalDueAmount = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [items]);

  const activeRemindersCount = useMemo(() => {
    return items.filter((i) => i.status.toLowerCase() !== "completed").length;
  }, [items]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Loading session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center max-w-lg mx-auto p-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/10">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to Taya Life-Admin</h2>
        <p className="text-slate-400 text-sm mt-3 mb-8 leading-relaxed">
          Sign in with your Google account to automatically track upcoming bills, subscriptions, deadlines, and view automated Google Calendar reminders.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to View Your Items</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Life Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organized records extracted from your Gmail inbox and manual SMS logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ingest"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Process SMS / Text</span>
          </Link>

          <button
            onClick={() => loadData(user.id, true)}
            disabled={refreshing}
            title="Refresh items from Supabase"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Reminders</span>
            <Inbox className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {activeRemindersCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending user attention</span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Due Amount</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {formatCurrency(totalDueAmount)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative extracted bills</span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Items</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {items.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Stored in Supabase</span>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Calendar Synced</span>
            <CalendarCheck2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {items.filter(i => i.due_date).length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled to Google Calendar</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search items by title, biller, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All" },
            { id: "bill", label: "Bills" },
            { id: "subscription", label: "Subscriptions" },
            { id: "payment", label: "Payments" },
            { id: "booking", label: "Bookings" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedType === type.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "glass text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Items List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-5 border border-slate-800/80 animate-pulse space-y-3">
              <div className="h-5 bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-850 rounded w-3/4" />
              <div className="h-4 bg-slate-900 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800/80 flex flex-col items-center">
          <Inbox className="w-10 h-10 text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No items match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {searchQuery || selectedType !== "all"
              ? "Try resetting filters or changing your search query."
              : "No life-admin items detected yet. Paste a message or trigger your Gmail watch."}
          </p>
          <Link
            href="/ingest"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Process Test Message</span>
          </Link>
        </div>
      )}
    </div>
  );
}
