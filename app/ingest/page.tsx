"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { processMessage } from "@/lib/api";
import { PipelineResponse } from "@/lib/types";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Zap,
  ArrowRight,
  RotateCcw
} from "lucide-react";

export default function MessageIngestPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [source, setSource] = useState("sms");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<PipelineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ready-to-test preset samples
  const samples = [
    {
      label: "Electricity Bill SMS",
      sender: "VM-BESCOM",
      source: "sms",
      text: "Dear Consumer, your electricity bill for CA No 10293847 is ₹1,420. Due date is 28-Oct-2026. Pay now at https://bescom.karnataka.gov.in to avoid late payment fee.",
    },
    {
      label: "Airtel Mobile Recharge",
      sender: "VM-AIRTEL",
      source: "sms",
      text: "Your Airtel Unlimited 5G pack expires on 30-Oct-2026. Recharge with ₹839 pack today to keep enjoying uninterrupted calls and 2GB/day data.",
    },
    {
      label: "Interview / Prep Schedule",
      sender: "careers@morganstanley.com",
      source: "email",
      text: "Dear Candidate, your Technical Round 1 interview is confirmed for tomorrow 26-Oct-2026 at 4:00 PM to 5:00 PM IST on Google Meet: https://meet.google.com/abc-defg-hij. Please join 5 mins early.",
    },
    {
      label: "Spam / Promo (Non-Actionable)",
      sender: "AD-DEALS",
      source: "sms",
      text: "Mega Diwali Sale! Get flat 50% discount on all sneakers. Use coupon DIWALI50. Limited period offer!",
    },
  ];

  const handleProcess = async () => {
    if (!message.trim()) {
      setError("Please paste or type a message first.");
      return;
    }

    const targetUserId = user?.id || "84a00afd-8716-4c16-8b2d-80bfd5a48455";

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await processMessage({
        userId: targetUserId,
        message,
        sender,
        source,
      });

      setResponse(result);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Pipeline request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = (sample: typeof samples[0]) => {
    setMessage(sample.text);
    setSender(sample.sender);
    setSource(sample.source);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Cpu className="w-7 h-7 text-indigo-400" />
          Message Ingest &amp; AI Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate inbound SMS notifications or test real email snippets against the multi-stage AI parser.
        </p>
      </div>

      {/* Preset Chips */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Quick Test Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {samples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleFillSample(s)}
              className="text-xs px-3 py-1.5 rounded-lg glass border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 hover:bg-indigo-600/10 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
        {/* Source & Sender Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Sender Header / Identifier (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. VM-AIRTEL, alerts@hdfcbank.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Message Source Channel
            </label>
            <div className="flex gap-2">
              {["sms", "email"].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSource(ch)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    source === ch
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "glass text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">
              Raw Message Content
            </label>
            {message && (
              <button
                onClick={() => setMessage("")}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <textarea
            rows={5}
            placeholder="Paste your email body or SMS message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-500 resize-y font-mono leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-500 mt-1">
            {message.length} characters
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleProcess}
          disabled={loading || !message.trim()}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Gemini AI Pipeline &amp; Deduplication...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Process Message with AI</span>
            </>
          )}
        </button>
      </div>

      {/* AI Pipeline Results Display */}
      {response && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {response.success ? (
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-red-500/20 text-red-400">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white">
                  Pipeline Execution: {response.stage.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-400">{response.message}</p>
              </div>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                response.stage === "completed"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              }`}
            >
              {response.stage}
            </span>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Regex Filter Section */}
            {response.regex_result && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Regex Candidate Check
                  </span>
                  <span className={response.regex_result.candidate ? "text-emerald-400" : "text-red-400"}>
                    {response.regex_result.candidate ? "PASSED" : "REJECTED"}
                  </span>
                </div>
                <div className="space-y-1 text-slate-400 text-[11px]">
                  <p>Keyword match: {String(response.regex_result.keyword)}</p>
                  <p>Date detected: {String(response.regex_result.date)}</p>
                  <p>Amount/Reference: {String(response.regex_result.amount_ref)}</p>
                </div>
              </div>
            )}

            {/* Actionability Classifier Section */}
            {response.actionability_result && (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Gemini Actionability
                  </span>
                  <span className={response.actionability_result.actionable ? "text-emerald-400" : "text-amber-400"}>
                    {response.actionability_result.actionable ? "ACTIONABLE" : "NON-ACTIONABLE"}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Reason:</strong> {response.actionability_result.reason}
                </p>
                <p className="text-[11px] text-slate-400">
                  Confidence: {(response.actionability_result.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>

          {/* Stored Record Info if completed */}
          {response.stored_record && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-indigo-300 font-semibold text-xs">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Saved in Supabase &amp; Synced to Google Calendar
                </span>
                <span className="text-[11px] text-indigo-400 font-mono">
                  ID: {String(response.stored_record.id || "").slice(0, 8)}...
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Item <strong className="text-white">{String(response.stored_record.title || "")}</strong> was verified and added to your life-admin items list.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
