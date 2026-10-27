"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { createCalendarEvent, fetchCalendarEvents } from "@/lib/api";
import { CalendarEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { 
  CalendarDays, 
  PlusCircle, 
  Loader2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Radio, 
  MailCheck, 
  Calendar,
  LogOut
} from "lucide-react";

export default function CalendarSyncPage() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states for manual calendar test event
  const [title, setTitle] = useState("Life Admin Review");
  const [description, setDescription] = useState("Review upcoming utility bills and subscriptions with Taya");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  const targetUserId = user?.id || "84a00afd-8716-4c16-8b2d-80bfd5a48455";

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      setError(null);
      const data = await fetchCalendarEvents(targetUserId);
      setEvents(data);
    } catch (err: unknown) {
      console.warn("Could not fetch calendar events:", err);
      // Not failing hard if user hasn't synced OAuth refresh token yet
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      setCreateSuccess(null);

      const startIso = `${date}T${startTime}:00+05:30`;
      const endIso = `${date}T${endTime}:00+05:30`;

      const result = await createCalendarEvent({
        userId: targetUserId,
        title,
        description,
        startTime: startIso,
        endTime: endIso,
        timezone: "Asia/Kolkata",
      });

      setCreateSuccess(`Event successfully scheduled! ID: ${result.event_id}`);
      loadEvents();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to create Google Calendar event");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-400" />
            Calendar &amp; Automation Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage Google Calendar integration and verify push notification status.
          </p>
        </div>

        {user && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Google Account</span>
          </button>
        )}
      </div>

      {/* Sync Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Google Calendar Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Google Calendar API</h3>
                <span className="text-[11px] text-slate-400">OAuth2 Scope: calendar.events</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All actionable bills and deadlines discovered by Taya are automatically inserted as structured calendar events with proper IST time offsets.
          </p>
          <div className="pt-2 border-t border-slate-800/60">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              <span>Open Google Calendar web</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Gmail PubSub Watch Card */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                <MailCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Gmail Push Webhook</h3>
                <span className="text-[11px] text-slate-400">Google Cloud Pub/Sub</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              Listening
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Whenever a bill or statement arrives in your Gmail, Google Pub/Sub triggers Taya&apos;s backend webhook at <code className="text-[10px] text-slate-300 bg-slate-900 px-1 py-0.5 rounded">/google/webhook</code> without any polling.
          </p>
        </div>
      </div>

      {/* Manual Test Event Creator */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Test Google Calendar Event Creation</span>
          </h2>
          <span className="text-xs text-slate-400">Endpoint: /calendar/create</span>
        </div>

        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Start Time (IST)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                End Time (IST)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl glass border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-200"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {createSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{createSuccess}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scheduling to Google Calendar...</span>
              </>
            ) : (
              <>
                <CalendarDays className="w-4 h-4" />
                <span>Create Calendar Event via Backend</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Upcoming Events List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Upcoming Google Calendar Events</span>
          </h2>

          <button
            onClick={loadEvents}
            disabled={loadingEvents}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {loadingEvents ? "Refreshing..." : "Refresh Events"}
          </button>
        </div>

        {loadingEvents ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Fetching events from Google Calendar...</span>
          </div>
        ) : events.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {events.map((ev) => (
              <div key={ev.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{ev.summary}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(ev.start)} &bull; {ev.start ? ev.start.split("T")[1]?.slice(0, 5) : ""}
                  </p>
                  {ev.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ev.description}</p>
                  )}
                </div>

                {ev.html_link && (
                  <a
                    href={ev.html_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0"
                  >
                    View in Calendar
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            No events found or Google Calendar session is initializing. Click Create Calendar Event above to schedule your first event.
          </p>
        )}
      </div>
    </div>
  );
}
