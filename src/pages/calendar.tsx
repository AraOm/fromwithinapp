import React from "react";
import {
  type CalendarEvent,
  buildGoogleCalendarUrl,
  downloadICS,
} from "@/lib/calendar";

const exampleEvent: CalendarEvent = {
  title: "From Within – Grounding Meditation",
  description:
    "A sample event so you can test calendar downloads and Google Calendar links.",
  location: "From Within",
  start: new Date(),
  end: new Date(Date.now() + 60 * 60 * 1000),
};

export default function CalendarPage() {
  const googleUrl = buildGoogleCalendarUrl(exampleEvent);

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold">Calendar Tools</h1>
        <p className="text-sm text-muted-foreground">
          This page exists to host calendar helpers used throughout the app and
          to let you quickly test them.
        </p>

        <div className="space-y-2 rounded-lg border bg-card p-4">
          <h2 className="text-lg font-medium">Test event</h2>
          <p className="text-sm text-muted-foreground">
            Title: <span className="font-semibold">{exampleEvent.title}</span>
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Open in Google Calendar
            </a>

            <button
              onClick={() => downloadICS(exampleEvent)}
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Download .ics file
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
