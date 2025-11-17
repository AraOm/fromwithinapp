"use client";

import React from "react";
import { Headphones, Sparkles, Moon, PlayCircle } from "lucide-react";

type ZenPlaylist = {
  id: string; // Spotify playlist ID
  title: string;
  mood: string;
  description: string;
};

const ZEN_PLAYLISTS: ZenPlaylist[] = [
  {
    id: "37i9dQZF1DWZqd5JICZI0u", // Peaceful Meditation (Spotify)
    title: "Soft Cosmic Stillness",
    mood: "Deep Calm • Nervous System",
    description:
      "Slow, spacious textures to help your body unwind and your mind soften into meditation.",
  },
  {
    id: "37i9dQZF1DX3Ogo9pFvBkY", // Ambient Relaxation
    title: "Ambient Aura Field",
    mood: "Focus • Flow • Creative Work",
    description:
      "Gentle ambient soundscapes that support journaling, working, or quiet self-reflection.",
  },
  {
    id: "4iGAttKqCR2Jg9kl2cUiBq", // Atmospheric Calm
    title: "Starlit Healing Waves",
    mood: "Sleep • Rest • Recovery",
    description:
      "Atmospheric tones for evening wind-down, deep rest, and post-practice integration.",
  },
];

export default function ZenPlaylists() {
  return (
    <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/40 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            <Sparkles className="mr-2 h-4 w-4" />
            Moments of Zen
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-50">
            Meditation & Focus Playlists
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Tap a playlist to open it in Spotify and let your nervous system
            soak in some quiet, cosmic stillness.
          </p>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 ring-1 ring-sky-500/30 sm:flex">
          <Headphones className="h-6 w-6 text-sky-300" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {ZEN_PLAYLISTS.map((pl) => {
          const spotifyUrl = `https://open.spotify.com/playlist/${pl.id}`;
          return (
            <a
              key={pl.id}
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 transition-transform duration-200 hover:-translate-y-1 hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-sky-300" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-400">
                    {pl.mood}
                  </p>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">
                  {pl.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {pl.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <PlayCircle className="h-4 w-4 text-sky-300 transition-transform group-hover:scale-110" />
                  Play on Spotify
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  Requires Spotify
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
