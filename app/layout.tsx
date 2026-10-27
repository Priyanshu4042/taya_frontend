import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Taya | Your Life-Admin, Sorted",
  description: "Automated Life-Admin and AI Reminder Scheduling Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>Taya AI Life Admin &bull; Powered by Google Gemini &amp; Supabase</p>
              <p className="text-[11px] text-slate-400">Integrated with Google Calendar &amp; Gmail Push Webhook</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
