"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const FEED_KEY = "gw_feed";
const EVENTS_KEY = "gw_events";
const EXCHANGE_KEY = "gw_exchange";

// ---------- Types ----------
type FeedPost = {
  id: string;
  text: string;
  mediaDataUrl?: string;
  mediaUrl?: string;
  mediaKind?: "image" | "video";
  createdAt: number;
};

type EventItem = {
  id: string;
  title: string;
  when: string;
  location: string;
  note?: string;
  createdAt: number;
};

type ExchangeItem = {
  id: string;
  type: "Offer" | "Request";
  topic: string;
  details: string;
  contact?: string;
  createdAt: number;
};

// ---------- Helpers ----------
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function detectMediaKindFromFilename(
  name?: string | null
): "image" | "video" | undefined {
  if (!name) return undefined;
  const lower = name.toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/.test(lower)) return "image";
  if (/\.(mp4|webm|ogg|mov|m4v)$/.test(lower)) return "video";
  return undefined;
}

function detectMediaKindFromMime(
  mime?: string | null
): "image" | "video" | undefined {
  if (!mime) return undefined;
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return undefined;
}

// ---------- Glow Button (matches Play page vibe) ----------
type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

function GlowButton({
  children,
  className = "",
  size = "md",
  ...props
}: GlowButtonProps) {
  const padding =
    size === "sm"
      ? "px-3 py-1.5 text-xs md:text-sm"
      : "px-4 py-2 text-sm md:text-sm";

  return (
    <button
      {...props}
      className={`relative inline-flex rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[1.5px] shadow-lg shadow-violet-500/40 transition hover:shadow-violet-400/70 hover:-translate-y-[1px] ${className}`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-slate-950 ${padding} text-slate-50`}
      >
        {children}
      </span>
    </button>
  );
}

// ---------- Page ----------
export default function CommunityPage() {
  const mounted = useMounted();

  const tabs = [
    "Feed",
    "Spiritual Classes & Workshops",
    "Energy Exchange",
    "Calendar View",
  ] as const;
  type Tab = (typeof tabs)[number];
  const [tab, setTab] = useState<Tab>("Feed");

  // Feed state
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [feedText, setFeedText] = useState("");
  const [feedImageUrl, setFeedImageUrl] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | undefined>(
    undefined
  );
  const [uploadKind, setUploadKind] = useState<"image" | "video" | undefined>(
    undefined
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Events state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [evTitle, setEvTitle] = useState("");
  const [evWhen, setEvWhen] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evNote, setEvNote] = useState("");

  // Exchange state
  const [exchange, setExchange] = useState<ExchangeItem[]>([]);
  const [exType, setExType] = useState<ExchangeItem["type"]>("Offer");
  const [exTopic, setExTopic] = useState("Reiki");
  const [exDetails, setExDetails] = useState("");
  const [exContact, setExContact] = useState("");

  // ---------- Load after mount ----------
  useEffect(() => {
    if (!mounted) return;
    try {
      setFeed(JSON.parse(localStorage.getItem(FEED_KEY) || "[]"));
      setEvents(JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]"));
      setExchange(JSON.parse(localStorage.getItem(EXCHANGE_KEY) || "[]"));
    } catch {}
  }, [mounted]);

  // ---------- Persist ----------
  useEffect(() => {
    if (mounted) localStorage.setItem(FEED_KEY, JSON.stringify(feed));
  }, [feed, mounted]);
  useEffect(() => {
    if (mounted) localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events, mounted]);
  useEffect(() => {
    if (mounted) localStorage.setItem(EXCHANGE_KEY, JSON.stringify(exchange));
  }, [exchange, mounted]);

  // ---------- Upload handlers ----------
  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChosenFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const kind =
      detectMediaKindFromMime(file.type) ??
      detectMediaKindFromFilename(file.name) ??
      "image";
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUploadPreview(dataUrl);
      setUploadKind(kind);
      setFeedImageUrl("");
    } catch {}
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChosenFiles(e.target.files);
    e.target.value = "";
  };

  // Drag & Drop UI events
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleChosenFiles(e.dataTransfer?.files || null);
    };

    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  // ---------- Feed actions ----------
  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    const t = feedText.trim();
    const url = feedImageUrl.trim();

    const hasUpload = !!uploadPreview;
    const hasUrl = !!url;
    if (!t && !hasUpload && !hasUrl) return;

    const mediaKind: "image" | "video" | undefined = hasUpload
      ? uploadKind
      : url
      ? /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)
        ? "video"
        : "image"
      : undefined;

    const newPost: FeedPost = {
      id: String(Date.now()),
      text: t,
      mediaDataUrl: hasUpload ? uploadPreview : undefined,
      mediaUrl: !hasUpload && hasUrl ? url : undefined,
      mediaKind,
      createdAt: Date.now(),
    };

    setFeed((p) => [newPost, ...p]);
    setFeedText("");
    setFeedImageUrl("");
    setUploadPreview(undefined);
    setUploadKind(undefined);
  };

  const delPost = (id: string) => setFeed((p) => p.filter((x) => x.id !== id));

  // ---------- Events actions ----------
  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evWhen.trim()) return;
    setEvents((p) => [
      {
        id: String(Date.now()),
        title: evTitle.trim(),
        when: evWhen,
        location: evLocation.trim(),
        note: evNote.trim() || undefined,
        createdAt: Date.now(),
      },
      ...p,
    ]);
    setEvTitle("");
    setEvWhen("");
    setEvLocation("");
    setEvNote("");
  };

  const delEvent = (id: string) =>
    setEvents((p) => p.filter((x) => x.id !== id));
  const addToCalendar = (ev: EventItem) => {
    alert(`Added "${ev.title}" to your in-app calendar.`);
  };

  // ---------- Exchange actions ----------
  const addExchange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exDetails.trim()) return;
    setExchange((p) => [
      {
        id: String(Date.now()),
        type: exType,
        topic: exTopic,
        details: exDetails.trim(),
        contact: exContact.trim() || undefined,
        createdAt: Date.now(),
      },
      ...p,
    ]);
    setExDetails("");
    setExContact("");
  };

  const delExchange = (id: string) =>
    setExchange((p) => p.filter((x) => x.id !== id));

  // ---------- Calendar ----------
  const calendarSorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.when).getTime() - new Date(b.when).getTime()
      ),
    [events]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-8 md:px-8">
        <h1 className="sr-only">Community</h1>

        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Together
            </p>
            <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Community
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Your circle of support, love, and light — share updates, post
              gatherings, and offer energy exchanges.
            </p>
          </div>

          <div className="mt-2 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Community · Classes · Energy Exchange
            </p>
          </div>
        </header>

        {/* Tabs */}
        <section className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((t) => (
              <GlowButton
                key={t}
                type="button"
                size="sm"
                onClick={() => setTab(t)}
                className={
                  tab === t
                    ? ""
                    : "opacity-60 hover:opacity-100 hover:shadow-violet-300/60"
                }
              >
                {t}
              </GlowButton>
            ))}
          </div>

          {/* Feed */}
          {tab === "Feed" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Share photos, videos, progress updates, and spiritual
                reflections with your From Within circle.
              </p>

              <form
                onSubmit={addPost}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/60 space-y-3"
              >
                <textarea
                  value={feedText}
                  onChange={(e) => setFeedText(e.target.value)}
                  placeholder="Write a reflection, win, or moment of magic…"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 min-h-[80px] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                />

                {/* Upload */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div
                    ref={dropRef}
                    className={`relative flex cursor-pointer items-center justify-center rounded-2xl border px-3 py-4 text-sm text-slate-300 transition ${
                      isDragging
                        ? "border-violet-400 bg-slate-900/80 shadow-[0_0_40px_rgba(139,92,246,0.35)]"
                        : "border-slate-700 bg-slate-900/60 hover:border-violet-400/80 hover:bg-slate-900/80 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to choose a file, or drag & drop here"
                  >
                    <div className="pointer-events-none absolute -left-10 top-0 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    <div className="relative text-center">
                      <div className="font-medium text-slate-50">
                        Upload photo or video
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Drag & drop or click to choose a file
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Tip: Keep files small. Browser storage ≈ 5–10 MB total.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {(uploadPreview || feedImageUrl) && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                    <div className="text-xs text-slate-400 mb-2">Preview</div>
                    {uploadPreview ? (
                      uploadKind === "video" ? (
                        <video
                          className="w-full rounded-xl max-h-72"
                          controls
                          src={uploadPreview}
                        />
                      ) : (
                        <img
                          className="w-full rounded-xl max-h-72 object-cover"
                          src={uploadPreview}
                          alt=""
                        />
                      )
                    ) : /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(feedImageUrl) ? (
                      <video
                        className="w-full rounded-xl max-h-72"
                        controls
                        src={feedImageUrl}
                      />
                    ) : (
                      <img
                        className="w-full rounded-xl max-h-72 object-cover"
                        src={feedImageUrl}
                        alt=""
                      />
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {uploadPreview && (
                        <GlowButton
                          type="button"
                          size="sm"
                          onClick={() => {
                            setUploadPreview(undefined);
                            setUploadKind(undefined);
                          }}
                        >
                          Remove upload
                        </GlowButton>
                      )}
                      {feedImageUrl && (
                        <GlowButton
                          type="button"
                          size="sm"
                          onClick={() => setFeedImageUrl("")}
                        >
                          Clear URL
                        </GlowButton>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <GlowButton type="submit">Post</GlowButton>
                </div>
              </form>

              <ul className="space-y-3">
                {feed.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-slate-950/60"
                  >
                    <div className="text-xs text-slate-400 mb-1">
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                    {p.text && (
                      <p className="mb-2 text-sm text-slate-100">{p.text}</p>
                    )}

                    {p.mediaKind === "video" ? (
                      <video
                        className="rounded-2xl w-full max-h-96"
                        controls
                        src={p.mediaDataUrl || p.mediaUrl}
                      />
                    ) : p.mediaDataUrl || p.mediaUrl ? (
                      <img
                        src={p.mediaDataUrl || p.mediaUrl}
                        alt=""
                        className="rounded-2xl w-full object-cover max-h-96"
                      />
                    ) : null}

                    <div className="mt-3">
                      <GlowButton
                        type="button"
                        size="sm"
                        onClick={() => delPost(p.id)}
                      >
                        Delete
                      </GlowButton>
                    </div>
                  </li>
                ))}
                {feed.length === 0 && (
                  <p className="text-sm text-slate-400">No posts yet.</p>
                )}
              </ul>
            </div>
          )}

          {/* Spiritual Classes & Workshops */}
          {tab === "Spiritual Classes & Workshops" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Members can post upcoming gatherings, circles, retreats, or
                classes. Each post supports “Add to Calendar”.
              </p>

              <form
                onSubmit={addEvent}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/60 grid gap-3 md:grid-cols-2"
              >
                <input
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="Event title"
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                />
                <input
                  type="datetime-local"
                  value={evWhen}
                  onChange={(e) => setEvWhen(e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                />
                <input
                  value={evLocation}
                  onChange={(e) => setEvLocation(e.target.value)}
                  placeholder="Location or link"
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                />
                <input
                  value={evNote}
                  onChange={(e) => setEvNote(e.target.value)}
                  placeholder="Optional notes"
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                />
                <div className="md:col-span-2 flex justify-end">
                  <GlowButton type="submit">Add Event</GlowButton>
                </div>
              </form>

              <ul className="space-y-3">
                {events.map((ev) => (
                  <li
                    key={ev.id}
                    className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-slate-950/60"
                  >
                    <div className="font-medium text-slate-50">
                      {ev.title}
                    </div>
                    <div className="text-sm text-slate-300">
                      {new Date(ev.when).toLocaleString()}{" "}
                      {ev.location ? `• ${ev.location}` : ""}
                    </div>
                    {ev.note && (
                      <div className="text-sm mt-1 text-slate-100">
                        {ev.note}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <GlowButton
                        type="button"
                        size="sm"
                        onClick={() => addToCalendar(ev)}
                      >
                        Add to Calendar
                      </GlowButton>
                      <GlowButton
                        type="button"
                        size="sm"
                        onClick={() => delEvent(ev.id)}
                      >
                        Delete
                      </GlowButton>
                    </div>
                  </li>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-slate-400">No events yet.</p>
                )}
              </ul>
            </div>
          )}

          {/* Energy Exchange */}
          {tab === "Energy Exchange" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Peer-to-peer support space — offer Reiki, crystal swaps, or
                intuitive guidance.
              </p>

              <form
                onSubmit={addExchange}
                className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/60 grid gap-3 md:grid-cols-2"
              >
                <select
                  value={exType}
                  onChange={(e) =>
                    setExType(e.target.value as ExchangeItem["type"])
                  }
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                >
                  <option>Offer</option>
                  <option>Request</option>
                </select>
                <select
                  value={exTopic}
                  onChange={(e) => setExTopic(e.target.value)}
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-400/70"
                >
                  <option>Reiki</option>
                  <option>Crystal Swap</option>
                  <option>Meditation Guidance</option>
                  <option>Breathwork</option>
                  <option>Yoga Support</option>
                </select>
                <input
                  value={exContact}
                  onChange={(e) => setExContact(e.target.value)}
                  placeholder="Contact (email/IG/phone)"
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70 md:col-span-2"
                />
                <textarea
                  value={exDetails}
                  onChange={(e) => setExDetails(e.target.value)}
                  placeholder="Describe what you offer or request…"
                  className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 min-h-[80px] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400/70 md:col-span-2"
                />
                <div className="md:col-span-2 flex justify-end">
                  <GlowButton type="submit">Post</GlowButton>
                </div>
              </form>

              <ul className="space-y-3">
                {exchange.map((x) => (
                  <li
                    key={x.id}
                    className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-md shadow-slate-950/60"
                  >
                    <div className="text-sm text-slate-400">
                      {x.type} • {x.topic}
                    </div>
                    <div className="mt-1 text-sm text-slate-100">
                      {x.details}
                    </div>
                    {x.contact && (
                      <div className="text-sm text-slate-300 mt-1">
                        Contact: {x.contact}
                      </div>
                    )}
                    <div className="mt-3">
                      <GlowButton
                        type="button"
                        size="sm"
                        onClick={() => delExchange(x.id)}
                      >
                        Delete
                      </GlowButton>
                    </div>
                  </li>
                ))}
                {exchange.length === 0 && (
                  <p className="text-sm text-slate-400">No posts yet.</p>
                )}
              </ul>
            </div>
          )}

          {/* Calendar View */}
          {tab === "Calendar View" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Personalized schedule auto-populated with your community events.
              </p>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl shadow-slate-950/60">
                <table className="w-full text-sm text-slate-100">
                  <thead className="bg-slate-900/80">
                    <tr className="text-left">
                      <th className="p-3 font-medium text-slate-300">When</th>
                      <th className="p-3 font-medium text-slate-300">Title</th>
                      <th className="p-3 font-medium text-slate-300">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarSorted.map((ev) => (
                      <tr
                        key={ev.id}
                        className="border-t border-slate-800/80"
                      >
                        <td className="p-3 text-slate-200">
                          {new Date(ev.when).toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-100">{ev.title}</td>
                        <td className="p-3 text-slate-300">
                          {ev.location || "—"}
                        </td>
                      </tr>
                    ))}
                    {calendarSorted.length === 0 && (
                      <tr>
                        <td
                          className="p-3 text-slate-400"
                          colSpan={3}
                        >
                          No calendar items yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
