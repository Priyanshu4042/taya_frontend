# Taya Web Frontend

A modern, aesthetic web application for **Taya AI Life Admin**, built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Connected directly with the existing FastAPI backend and Supabase database without modifying backend code.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphism & Ambient Glow UI
- **Icons**: Lucide React
- **Auth**: Supabase Client SDK (`@supabase/supabase-js`) with Google OAuth (Gmail & Calendar scopes)
- **Backend Communication**: Native REST fetch client connected to `https://taya-server-708184550477.asia-south1.run.app`

---

## Available Pages & Features

1. **Dashboard (`/`)**
   - Overview metrics: Active Reminders, Total Due Amount (₹), Total Stored Items, and Calendar-synced counts.
   - Filter items by category (Bills, Subscriptions, Payments, Bookings) and Status.
   - Real-time search by title, biller, or snippet keyword.
   - Collapsible source message snippets and direct action links.
   - Refresh button querying `GET /items?user_id=...`.

2. **Message Ingest & AI Pipeline (`/ingest`)**
   - Expandable textarea for manual ingestion of SMS or email bodies.
   - One-click presets (Electricity bill, Airtel recharge expiry, Interview Google Meet, Spam promo).
   - Source channel selector (`sms` / `email`) and optional sender identifier.
   - Comprehensive multi-stage execution breakdown:
     - Regex candidate check
     - Gemini Actionability Classifier (Actionable / Non-actionable + Reason + Confidence)
     - Structured entity extraction
     - Supabase vector deduplication & Google Calendar insertion status.

3. **Calendar & Automation Sync (`/calendar`)**
   - Integration status cards for Google Calendar API and Google Pub/Sub Gmail Webhook.
   - Interactive Test Event Creator calling `POST /calendar/create`.
   - Live timeline of upcoming Google Calendar events from `GET /calendar/events`.
   - Sign out Google account.

4. **Authentication (`/login` & `/auth/callback`)**
   - Branded Google OAuth sign-in requesting offline access and consent for `calendar.events` and `gmail.modify`.
   - Automatic token forwarding to backend (`POST /google/store-token`) upon sign-in.

---

## Running Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
