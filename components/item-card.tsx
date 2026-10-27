"use client";

import React, { useState } from "react";
import { Item } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Receipt, 
  Tv, 
  CreditCard, 
  Plane, 
  Bell, 
  ExternalLink, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Building2,
  ShieldCheck
} from "lucide-react";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Pick color and icon based on item type
  const getTypeConfig = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("bill")) {
      return {
        icon: Receipt,
        bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        badgeBg: "bg-amber-500/10 text-amber-300",
        label: "Bill",
      };
    }
    if (t.includes("sub") || t.includes("recharge")) {
      return {
        icon: Tv,
        bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        badgeBg: "bg-purple-500/10 text-purple-300",
        label: "Subscription",
      };
    }
    if (t.includes("pay") || t.includes("emi")) {
      return {
        icon: CreditCard,
        bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        badgeBg: "bg-emerald-500/10 text-emerald-300",
        label: "Payment",
      };
    }
    if (t.includes("book") || t.includes("flight") || t.includes("travel")) {
      return {
        icon: Plane,
        bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        badgeBg: "bg-sky-500/10 text-sky-300",
        label: "Booking",
      };
    }
    return {
      icon: Bell,
      bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      badgeBg: "bg-indigo-500/10 text-indigo-300",
      label: type || "Reminder",
    };
  };

  const config = getTypeConfig(item.type);
  const Icon = config.icon;

  const isPending = item.status.toLowerCase() === "pending" || item.status.toLowerCase() === "active";
  const isCompleted = item.status.toLowerCase() === "completed";

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 group hover:shadow-xl hover:shadow-black/40">
      <div className="flex items-start justify-between gap-4">
        {/* Left icon & main info */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className={`p-3 rounded-xl border shrink-0 ${config.bg}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badgeBg}`}>
                {config.label}
              </span>
              {item.biller_name && (
                <span className="text-xs text-slate-400 flex items-center gap-1 truncate font-medium">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  {item.biller_name}
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
              {item.title || "Untitled Reminder"}
            </h3>

            {/* Due date info */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Due: <strong className="text-slate-200">{formatDate(item.due_date)}</strong></span>
              </div>

              {item.confidence != null && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400" title={`Confidence: ${(item.confidence * 100).toFixed(0)}%`}>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{(item.confidence * 100).toFixed(0)}% Match</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right amount & status */}
        <div className="flex flex-col items-end shrink-0 gap-2">
          {item.amount != null ? (
            <div className="text-right">
              <span className="text-lg font-bold text-slate-100 tracking-tight">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium italic">
                No amount
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : isPending
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-slate-700/30 text-slate-400 border border-slate-700"
              }`}
            >
              {item.status || "Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Snippet expander */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-medium"
        >
          {showDetails ? (
            <>
              Hide source snippet <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View source snippet <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {item.links && (
          <a
            href={item.links}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-[11px]"
          >
            <span>Action Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Collapsible raw snippet */}
      {showDetails && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
          {item.raw_snippet || "No source message preserved."}
        </div>
      )}
    </div>
  );
}
