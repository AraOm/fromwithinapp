"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

/* ----------------------------- Glow helpers ----------------------------- */

type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
};

function GlowButton({
  size = "md",
  className = "",
  children,
  ...props
}: GlowButtonProps) {
  const padding =
    size === "sm" ? "px-3 py-1.5 text-xs md:text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      {...props}
      className={`inline-flex rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30 disabled:opacity-60 ${className}`}
    >
      <span
        className={`flex w-full items-center justify-center rounded-full bg-slate-950/95 ${padding} font-medium text-slate-50`}
      >
        {children}
      </span>
    </button>
  );
}

function GlowLabel({
  children,
  className = "",
  size = "sm",
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement> & { size?: "sm" | "md" }) {
  const padding =
    size === "sm" ? "px-3 py-1.5 text-xs md:text-sm" : "px-4 py-2 text-sm";
  return (
    <label
      {...rest}
      className={`inline-flex cursor-pointer rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30 ${className}`}
    >
      <span
        className={`rounded-full bg-slate-950/95 ${padding} font-medium text-slate-50`}
      >
        {children}
      </span>
    </label>
  );
}

/* ----------------------------- Types & Models ----------------------------- */

type CheckInMedia = {
  id: string;
  kind: "image" | "audio";
  dataUrl: string;
  name?: string;
};

type CheckInEntry = {
  id: string;
  createdAt: number;
  isDream?: boolean;
  sacredLocked?: boolean;
  shareToCommunity?: boolean;

  prompt: string;
  response: string;

  eventTitle?: string;
  eventDateISO?: string;
  tarotOfDay?: string;
  crystalOfDay?: string;
  foodNotes?: string;

  media?: CheckInMedia[];
};

type Biometrics = {
  sleepScore?: number;
  hrv?: number;
  stress?: number;
  steps?: number;
};

const LS_KEY = "guidewithin_checkins_v2";

function useMockBiometrics(): Biometrics {
  return { sleepScore: 72, hrv: 42, stress: 61, steps: 3850 };
}

/* ------------------------------- Small utils ------------------------------- */

function pickDifferent(options: string[], prev?: string) {
  const pool = prev ? options.filter((o) => o.trim() !== prev.trim()) : options.slice();
  if (pool.length === 0) return options[0];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

/* -------------------------- Prompt helpers -------------------------- */

async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = 3000
) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function localPromptSmart(
  biometrics: Biometrics,
  entries: CheckInEntry[],
  isDream: boolean,
  previousPrompt?: string
): string {
  if (isDream) {
    const dreamVariants = [
      "What symbols or feelings stood out in your dream, and what might they ask you to notice today?",
      "If your dream were a message to your body, what would its simplest sentence be?",
      "Which moment of the dream felt most alive, and where do you feel that sensation now?",
    ];
    return pickDifferent(dreamVariants, previousPrompt);
  }

  const poorSleep = (biometrics.sleepScore ?? 100) < 70;
  const highStress = (biometrics.stress ?? 0) > 60;
  const lowSteps = (biometrics.steps ?? 10000) < 4000;
  const lowHRV = (biometrics.hrv ?? 100) < 35;

  const needs: string[] = [];
  if (highStress) needs.push("stress relief");
  if (poorSleep) needs.push("rest");
  if (lowSteps) needs.push("gentle movement");
  if (lowHRV) needs.push("nervous system care");

  const last = entries[0]?.response;
  if (last && last.length > 40) {
    const followUps = [
      "What felt most meaningful about yesterday’s note—and what’s one small step to honor it today?",
      "What thread from yesterday do you want to carry forward, and what support would make it easy?",
      "What single action today would respect what you discovered yesterday?",
    ];
    return pickDifferent(followUps, previousPrompt);
  }

  const baseVariants = [
    `What does your body need most—${needs.join("/") || "care"}—and where can you offer it?`,
    "What would 1% more kindness toward your body look like in the next hour?",
    "If your breath led today, what would it ask you to soften, move, or nourish?",
  ];
  return pickDifferent(baseVariants, previousPrompt);
}

async function getPersonalizedPrompt(
  biometrics: Biometrics,
  recentEntries: CheckInEntry[],
  isDream: boolean,
  previousPrompt?: string
): Promise<string> {
  try {
    const res = await fetchWithTimeout(
      "/api/prompt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: isDream ? "dream" : "day",
          biometrics,
          recentEntries: recentEntries.slice(0, 5).map((e) => ({
            createdAt: e.createdAt,
            responsePreview: e.response.slice(0, 160),
          })),
          intent:
            "Return one concise, compassionate daily journaling question personalized to current state (~140 chars).",
        }),
      },
      3000
    );

    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      const q =
        data?.prompt || data?.question || data?.message || data?.result || null;
      if (q && typeof q === "string" && q.trim()) {
        const maybeDifferent = q.trim();
        if (previousPrompt && maybeDifferent === previousPrompt) {
          return localPromptSmart(biometrics, recentEntries, isDream, previousPrompt);
        }
        return maybeDifferent;
      }
    }
  } catch {
    // fall back locally
  }
  return localPromptSmart(biometrics, recentEntries, isDream, previousPrompt);
}

/* ----------------------------- Storage helpers ----------------------------- */

function loadEntries(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CheckInEntry[];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function saveEntries(all: CheckInEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

async function saveToBackend(_entry: CheckInEntry) {
  return;
}

/* -------------------------------- Components -------------------------------- */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs md:text-sm text-slate-200">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-500 bg-slate-900/60 text-indigo-400 focus:ring-indigo-400"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function CheckInPage() {
  const biometrics = useMockBiometrics();
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [query, setQuery] = useState("");

  const [isDream, setIsDream] = useState(false);
  const [sacredLocked, setSacredLocked] = useState(false);
  const [shareToCommunity, setShareToCommunity] = useState(false);

  const [prompt, setPrompt] = useState<string>("Loading your prompt…");
  const [response, setResponse] = useState<string>("");

  const [media, setMedia] = useState<CheckInMedia[]>([]);
  const [saving, setSaving] = useState(false);
  const [refreshingPrompt, setRefreshingPrompt] = useState(false);

  const [mentorResult, setMentorResult] = useState<string>(""); // reserved
  const [trendsOpen, setTrendsOpen] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  useEffect(() => {
    const local = localPromptSmart(biometrics, entries, isDream, prompt);
    setPrompt(local);
    getPersonalizedPrompt(biometrics, entries, isDream, local).then((q) => {
      if (q) setPrompt(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    biometrics.hrv,
    biometrics.sleepScore,
    biometrics.stress,
    biometrics.steps,
    entries.length,
    isDream,
  ]);

  const refreshPrompt = useCallback(async () => {
    setRefreshingPrompt(true);
    try {
      const local = localPromptSmart(biometrics, entries, isDream, prompt);
      setPrompt(local);
      const q = await getPersonalizedPrompt(biometrics, entries, isDream, local);
      if (q) setPrompt(q);
    } finally {
      setRefreshingPrompt(false);
    }
  }, [biometrics, entries, isDream, prompt]);

  // Media
  const handleFiles = useCallback(
    async (files: FileList | null, kind: "image" | "audio") => {
      if (!files) return;
      const fileArray = Array.from(files).slice(0, 8);
      const newMedia: CheckInMedia[] = [];
      for (const f of fileArray) {
        if (kind === "image" && !f.type.startsWith("image/")) continue;
        if (kind === "audio" && !f.type.startsWith("audio/")) continue;
        const dataUrl = await fileToDataURL(f);
        newMedia.push({
          id: `${Date.now()}_${f.name}_${Math.random().toString(36).slice(2)}`,
          kind,
          dataUrl,
          name: f.name,
        });
      }
      setMedia((prev) => [...newMedia, ...prev]);
    },
    []
  );

  function removeMedia(id: string) {
    setMedia((m) => m.filter((x) => x.id !== id));
  }

  const handleSave = useCallback(
    async () => {
      if (!response.trim()) {
        alert("Please write your reflection before saving.");
        return;
      }
      const entry: CheckInEntry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        createdAt: Date.now(),
        isDream,
        sacredLocked,
        shareToCommunity,
        prompt,
        response: response.trim(),
        media,
      };
      try {
        setSaving(true);
        const next = [entry, ...entries];
        setEntries(next);
        saveEntries(next);
        await saveToBackend(entry);

        setResponse("");
        setMedia([]);
      } finally {
        setSaving(false);
      }
    },
    [entries, isDream, sacredLocked, shareToCommunity, prompt, response, media]
  );

  const today = useMemo(() => new Date().toLocaleDateString(), []);
  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      [e.response, e.prompt].some((t) => t.toLowerCase().includes(q))
    );
  }, [entries, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Giant glowing orb backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[130vh] w-[130vh] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.45),_rgba(129,140,248,0.3),_rgba(56,189,248,0.15),_transparent_70%)] blur-3xl" />
      </div>

      {/* Extra subtle corner glows to match Play vibe */}
      <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-8 md:px-8">
        {/* Page header – Play-style */}
        <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Check-In
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-50 md:text-4xl">
              Check-In
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Daily reflections weaving dreams, body cues, and gentle prompts —
              your soft landing pad. Today • {today}
            </p>
          </div>

          <div className="mt-3 text-right md:mt-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              From Within
            </p>
            <p className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Journals · Dreams · Threads
            </p>
          </div>
        </header>

        {/* Prompt + modes row */}
        <section className="mb-6 grid gap-4 md:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
          {/* Prompt card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-fuchsia-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/12 blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {isDream ? "Dream Prompt" : "Guided Prompt"}
                  </p>
                  <p className="mt-1 text-base leading-snug text-slate-50 md:text-lg">
                    {prompt}
                  </p>
                </div>
                <GlowButton
                  type="button"
                  size="sm"
                  onClick={refreshPrompt}
                  disabled={refreshingPrompt}
                >
                  {refreshingPrompt ? "Refreshing…" : "New prompt"}
                </GlowButton>
              </div>

              <textarea
                className="mt-4 w-full resize-y rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                rows={6}
                placeholder={
                  isDream
                    ? "Record your dream symbols, feelings, scenes…"
                    : "Write freely…"
                }
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
          </div>

          {/* Modes & boundaries */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-violet-500/12 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Modes & Boundaries
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Shape how today&apos;s check-in is held.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Toggle
                  label="Dream Journal mode"
                  checked={isDream}
                  onChange={setIsDream}
                />
                <Toggle
                  label="Sacred Space lock ☥"
                  checked={sacredLocked}
                  onChange={setSacredLocked}
                />
                <Toggle
                  label="Share excerpt to Community"
                  checked={shareToCommunity}
                  onChange={setShareToCommunity}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Media card */}
        <section className="mb-6 relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.75)]">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-amber-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-sky-500/12 blur-3xl" />
          <div className="relative z-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Media Attachments
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Crystals, progress pics, or a quick voice note.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <GlowLabel size="sm">
                Add photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files, "image")}
                />
              </GlowLabel>
              <GlowLabel size="sm">
                Add voice note
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files, "audio")}
                />
              </GlowLabel>
            </div>

            {media.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80"
                  >
                    {m.kind === "image" ? (
                      <img
                        src={m.dataUrl}
                        alt={m.name || "attachment"}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <audio className="w-full" controls src={m.dataUrl} />
                    )}
                    <button
                      title="Remove"
                      onClick={() => removeMedia(m.id)}
                      className="absolute right-2 top-2 hidden rounded-full bg-black/80 px-2 py-1 text-[0.65rem] text-white group-hover:block"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-400">
                Nothing added yet. Optional, but powerful for tracking patterns.
              </p>
            )}
          </div>
        </section>

        {/* Save + search row */}
        <section className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
          {/* Save today */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.75)]">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-rose-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/12 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Save Today
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Capture this moment and tuck it into your archive.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <GlowButton
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Check-In"}
                </GlowButton>

                <GlowButton
                  type="button"
                  size="sm"
                  onClick={() => {
                    setResponse("");
                    setMedia([]);
                  }}
                >
                  Clear
                </GlowButton>

                <GlowButton
                  type="button"
                  size="sm"
                  onClick={() => setTrendsOpen(true)}
                >
                  View Trends
                </GlowButton>
              </div>
            </div>
          </div>

          {/* Search archive */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.75)]">
            <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-violet-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Search Archive
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Look back through themes, phrases, and seasons of you.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder='Try: "breath", "sleep", "gratitude"'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent entries */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-100">
              Recent Check-Ins
            </p>
            {filtered.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">No entries yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {filtered.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[0.7rem] text-slate-400">
                        {new Date(e.createdAt).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-[0.7rem] text-slate-200">
                        {e.isDream && (
                          <span className="rounded-full border border-slate-600 px-2 py-0.5">
                            Dream
                          </span>
                        )}
                        {e.sacredLocked && (
                          <span className="rounded-full border border-slate-600 px-2 py-0.5">
                            ☥ Locked
                          </span>
                        )}
                        {e.shareToCommunity && (
                          <span className="rounded-full border border-slate-600 px-2 py-0.5">
                            Shared
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-100">
                      <span className="font-medium">Q: </span>
                      {e.prompt}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-100">
                      <span className="font-medium">A: </span>
                      {e.response}
                    </p>

                    {e.media && e.media.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {e.media.map((m) =>
                          m.kind === "image" ? (
                            <img
                              key={m.id}
                              src={m.dataUrl}
                              alt={m.name || "attachment"}
                              className="h-20 w-full rounded-xl object-cover"
                            />
                          ) : (
                            <audio
                              key={m.id}
                              className="w-full"
                              controls
                              src={m.dataUrl}
                            />
                          )
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Trends modal */}
      {trendsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-xl overflow-auto rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-500/18 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-sky-500/18 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">
                  Search & Trends
                </h2>
                <GlowButton
                  type="button"
                  size="sm"
                  onClick={() => setTrendsOpen(false)}
                >
                  Close
                </GlowButton>
              </div>
              <QuickTrends entries={entries} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Trends (light) ----------------------------- */

function QuickTrends({ entries }: { entries: CheckInEntry[] }) {
  const text = entries.map((e) => e.response).join(" ");
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const stop = new Set([
    "the",
    "a",
    "and",
    "to",
    "of",
    "in",
    "for",
    "on",
    "is",
    "i",
    "it",
    "that",
    "this",
    "with",
    "my",
    "me",
    "at",
    "was",
    "are",
    "be",
    "an",
  ]);
  const map = new Map<string, number>();
  for (const w of words) if (!stop.has(w)) map.set(w, (map.get(w) ?? 0) + 1);
  const top = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-slate-100">Top words</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {top.map(([w, n]) => (
          <span
            key={w}
            className="rounded-full border border-slate-600 bg-slate-950/80 px-2 py-0.5 text-slate-100"
          >
            {w} • {n}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Use search on the main screen to filter entries by any of these.
      </p>
    </div>
  );
}

/* --------------------------------- Utils --------------------------------- */

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
