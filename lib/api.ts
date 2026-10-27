import { Item, CalendarEvent, PipelineResponse } from "./types";

const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://taya-server-708184550477.asia-south1.run.app").replace(/\/$/, "");

export async function fetchItems(userId: string): Promise<Item[]> {
  const url = `${BASE_URL}/items?user_id=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch items (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function processMessage(params: {
  userId: string;
  message: string;
  sender?: string;
  source?: string;
}): Promise<PipelineResponse> {
  const url = `${BASE_URL}/process-message`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: params.userId,
      message: params.message,
      sender: params.sender || "",
      source: params.source || "web",
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to process message (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function storeGoogleToken(params: {
  userId: string;
  providerRefreshToken: string;
  providerAccessToken?: string;
}): Promise<{ status: string }> {
  const url = `${BASE_URL}/google/store-token`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: params.userId,
      provider_refresh_token: params.providerRefreshToken,
      provider_access_token: params.providerAccessToken || "",
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to store Google token (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function fetchCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  const url = `${BASE_URL}/calendar/events?user_id=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch calendar events (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function createCalendarEvent(params: {
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  timezone?: string;
}): Promise<{ event_id: string; html_link: string; status: string }> {
  const url = `${BASE_URL}/calendar/create`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: params.userId,
      title: params.title,
      description: params.description || null,
      start_time: params.startTime,
      end_time: params.endTime,
      timezone: params.timezone || "Asia/Kolkata",
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create calendar event (${res.status}): ${errorText}`);
  }
  return res.json();
}

export async function fetchLatestEmail(userId: string): Promise<unknown> {
  const url = `${BASE_URL}/google/latest-email?user_id=${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch latest email (${res.status}): ${errorText}`);
  }
  return res.json();
}
