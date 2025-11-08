// src/components/ClassesSection.tsx
import React from "react";
import { buildGoogleCalendarUrl, downloadICS } from "@/lib/calendar";

export type ClassItem = {
  id: string;
  title: string;
  instructor: string;
  startISO: string;          // e.g. "2025-08-21T19:00:00"
  endISO: string;            // e.g. "2025-08-21T19:45:00"
  durationMin?: number;
  rating?: number;
  level?: string;            // e.g. "Beginner"
  joinedCount?: number;
  isLive?: boolean;
  location?: string;         // "Online" or URL/Place
  description?: string;
};

export default function ClassesSection({ classes }: { classes: ClassItem[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Spiritual Classes & Workshops</h2>
        <div className="text-sm text-gray-500">Live Classes · On‑Demand</div>
      </div>

      <div className="space-y-4">
        {classes.map((c) => {
          const start = new Date(c.startISO);
          const end = new Date(c.endISO);
          const liveBadge = c.isLive ? (
            <span className="ml-auto inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs">
              Live
            </span>
          ) : null;

          const evt = {
            title: c.title,
            description: c.description || `Live class with ${c.instructor}`,
            location: c.location || "Online",
            start,
            end,
          };

          return (
            <div
              key={c.id}
              className="rounded-xl border p-4 shadow-sm bg-white flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="font-medium">{c.title}</div>
                {liveBadge}
              </div>

              <div className="text-sm text-gray-600">
                with <span className="font-medium">{c.instructor}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div>🗓 {start.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
                <div>⏱ {c.durationMin ?? Math.max(15, Math.round((end.getTime() - start.getTime()) / 60000))} min</div>
                {c.rating && <div>⭐ {c.rating.toFixed(1)}{c.level ? ` (${c.level})` : ""}</div>}
                {c.joinedCount ? <div>👥 {c.joinedCount} joined</div> : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={buildGoogleCalendarUrl(evt)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Add to Google
                </a>
                <button
                  onClick={() => downloadICS(evt)}
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition"
                  title="Download .ics (Apple/Outlook)"
                >
                  Add .ics
                </button>

                {/* Example live-join & reminder buttons you already had */}
                <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                  Join Live
                </button>
                <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition">
                  Set Reminder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
