// src/pages/soundscapes.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Shuffle } from "lucide-react";

type Track = { id: string; url: string; gain: number };

const BANK: Track[] = [
  { id: "rain",  url: "/soundscapes/ambience/rain.mp3",   gain: 0.7 },
  { id: "wind",  url: "/soundscapes/ambience/wind.mp3",   gain: 0.55 },
  { id: "bowl",  url: "/soundscapes/ambience/bowl_c3.mp3", gain: 0.5 },
  { id: "birds", url: "/soundscapes/birds/birds.mp3",     gain: 0.6 },
  // you can add more from chimes if you want:
  // { id: "chime1", url: "/soundscapes/chimes/chime1.mp3", gain: 0.4 },
];

const PRESETS: Record<
  "Grounding" | "Relaxation" | "Focus" | "Sleep",
  Array<{ id: Track["id"]; gain?: number }>
> = {
  Grounding: [
    { id: "rain", gain: 0.75 },
    { id: "bowl", gain: 0.55 },
    { id: "wind", gain: 0.45 },
  ],
  Relaxation: [
    { id: "bowl", gain: 0.6 },
    { id: "birds", gain: 0.4 },
    { id: "wind", gain: 0.5 },
  ],
  Focus: [
    { id: "bowl", gain: 0.48 },
    { id: "rain", gain: 0.6 },
    { id: "wind", gain: 0.4 },
  ],
  Sleep: [
    { id: "rain", gain: 0.7 },
    { id: "wind", gain: 0.5 },
    { id: "bowl", gain: 0.45 },
  ],
};

function pickN<T>(arr: T[], n: number) {
  const a = [...arr];
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, a.length); i++) {
    const j = Math.floor(Math.random() * a.length);
    out.push(a.splice(j, 1)[0]);
  }
  return out;
}

export default function SoundscapesPage() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainsRef = useRef<Record<string, GainNode>>({});
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  const sourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selection, setSelection] = useState<Track[]>([]);
  const [mode, setMode] = useState<keyof typeof PRESETS | null>(null);

  // Preload
  useEffect(() => {
    let mounted = true;
    (async () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      const loads = BANK.map(async (t) => {
        try {
          const res = await fetch(t.url, { cache: "force-cache" });
          const arr = await res.arrayBuffer();
          const buf = await ctx.decodeAudioData(arr);
          buffersRef.current[t.id] = buf;
        } catch (err) {
          console.warn("Failed to load", t.url, err);
        }
      });

      await Promise.race([
        Promise.allSettled(loads),
        new Promise((r) => setTimeout(r, 2200)), // <=3s max
      ]);

      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
      stopAll();
      ctxRef.current?.close();
    };
  }, []);

  const resolvePreset = (m: keyof typeof PRESETS): Track[] => {
    const baseById = Object.fromEntries(BANK.map((b) => [b.id, b]));
    return PRESETS[m]
      .map((p) => {
        const base = baseById[p.id];
        return { ...base, gain: p.gain ?? base.gain };
      })
      .filter(Boolean);
  };

  const startOrResume = async () => {
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") await ctx.resume();

    const sel =
      mode != null ? resolvePreset(mode) :
      selection.length ? selection :
      pickN(BANK, 3);

    setSelection(sel);
    playSelection(sel);
  };

  const playSelection = (sel: Track[]) => {
    stopAll();
    const ctx = ctxRef.current!;
    sel.forEach((t, idx) => {
      const buf = buffersRef.current[t.id];
      if (!buf) return;

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.0001;

      src.connect(gain).connect(ctx.destination);
      src.start(0, (idx * 0.7) % (buf.duration || 1));

      sourcesRef.current[t.id] = src;
      gainsRef.current[t.id] = gain;

      gain.gain.linearRampToValueAtTime(t.gain, ctx.currentTime + 0.9);
    });
    setPlaying(true);
  };

  const stopAll = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    Object.values(gainsRef.current).forEach((g) => {
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    });
    setTimeout(() => {
      Object.values(sourcesRef.current).forEach((s) => s.stop());
      gainsRef.current = {};
      sourcesRef.current = {};
    }, 450);
    setPlaying(false);
  };

  const shuffle = () => {
    const sel = mode != null ? resolvePreset(mode) : pickN(BANK, 3);
    setSelection(sel);
    if (playing) playSelection(sel);
  };

  const modes: Array<keyof typeof PRESETS> = useMemo(
    () => ["Grounding", "Relaxation", "Focus", "Sleep"],
    []
  );

  return (
    <main className="mx-auto max-w-screen-md px-4 pb-24 pt-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Soundscapes</h1>
      </header>

      <section className="rounded-2xl border p-4 bg-white">
        {/* Mode pills */}
        <div className="mb-3 flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                const preset = resolvePreset(m);
                setSelection(preset);
                if (playing) playSelection(preset);
              }}
              className={[
                "rounded-full border px-4 py-2 text-sm hover:bg-gray-50 transition",
                mode === m ? "bg-gray-100 border-gray-400" : "bg-white",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
          <button
            onClick={() => setMode(null)}
            className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50 bg-white"
          >
            Any
          </button>
        </div>

        {/* Main controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={!ready}
            onClick={playing ? stopAll : startOrResume}
            className="rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {playing ? (
              <span className="inline-flex items-center gap-2">
                <Pause className="h-4 w-4" /> Pause
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" /> Begin Ritual
              </span>
            )}
          </button>

          <button
            disabled={!ready}
            onClick={shuffle}
            className="rounded-full border px-3.5 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Shuffle className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
