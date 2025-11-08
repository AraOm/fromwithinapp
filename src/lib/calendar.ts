// src/lib/calendar.ts
export type CalendarEvent = {
    title: string;
    description?: string;
    location?: string;
    start: Date; // local time
    end: Date;   // local time
  };
  
  const pad = (n: number) => String(n).padStart(2, "0");
  const toUTCStamp = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00Z`;
  
  export function buildGoogleCalendarUrl(e: CalendarEvent) {
    const base = "https://calendar.google.com/calendar/render";
    const dates = `${toUTCStamp(e.start)}/${toUTCStamp(e.end)}`;
    const qs = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      details: e.description || "",
      location: e.location || "",
      dates,
    });
    return `${base}?${qs.toString()}`;
  }
  
  export function downloadICS(e: CalendarEvent) {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//GuideWithin//Events//EN",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}`,
      `DTSTAMP:${toUTCStamp(new Date())}`,
      `DTSTART:${toUTCStamp(e.start)}`,
      `DTEND:${toUTCStamp(e.end)}`,
      `SUMMARY:${e.title}`,
      `DESCRIPTION:${(e.description || "").replace(/\n/g, "\\n")}`,
      `LOCATION:${e.location || ""}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${e.title.replace(/\s+/g, "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  