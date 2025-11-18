// src/components/ConnectWearable.tsx
"use client";

import React from "react";
import { Watch, Activity, HeartPulse, Moon } from "lucide-react";

type Provider = "fitbit" | "oura" | "googlefit" | "apple" | "garmin";

const PROVIDERS: {
  id: Provider;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "fitbit",
    label: "Fitbit",
    description: "Steps · Sleep · Heart",
    icon: <Activity className="h-3.5 w-3.5" />,
  },
  {
    id: "oura",
    label: "Oura",
    description: "Sleep · HRV · Readiness",
    icon: <Moon className="h-3.5 w-3.5" />,
  },
  {
    id: "googlefit",
    label: "Google Fit",
    description: "Android steps & heart",
    icon: <HeartPulse className="h-3.5 w-3.5" />,
  },
  {
    id: "apple",
    label: "Apple Health",
    description: "iPhone · Apple Watch",
    icon: <Watch className="h-3.5 w-3.5" />,
  },
  {
    id: "garmin",
    label: "Garmin",
    description: "Outdoor · Performance",
    icon: <Activity className="h-3.5 w-3.5" />,
  },
];

function startOAuth(provider: Provider) {
  // Uses your existing API pattern: /api/oauth/{provider}/start
  window.location.href = `/api/oauth/${provider}/start`;
}

export default function ConnectWearable() {
  return (
    <section className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 ring-1 ring-slate-700/80">
            <Watch className="h-4 w-4 text-slate-100" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-200">
              CONNECT WEARABLE
            </p>
            <p className="text-[10px] text-slate-400">
              Sync sleep, HRV & movement from your devices.
            </p>
          </div>
        </div>
      </div>

      {/* Capsules */}
      <div className="mt-2 flex flex-wrap gap-2">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => startOAuth(p.id)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-100 shadow-sm shadow-black/30 transition hover:border-violet-500/70 hover:bg-slate-900"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800/90">
              {p.icon}
            </span>
            <span className="font-medium">{p.label}</span>
            <span className="text-[10px] text-slate-400">· {p.description}</span>
          </button>
        ))}
      </div>

      <p className="mt-2 text-[10px] text-slate-500">
        Data stays encrypted and private — used only to reflect your energy
        back to you.
      </p>
    </section>
  );
}
