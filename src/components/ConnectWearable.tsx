// src/components/ConnectWearable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Watch, Activity, HeartPulse, Moon } from "lucide-react";

type Provider = "fitbit" | "oura" | "googlefit";

const COOKIE_KEY = "gw_wearable_connected";

/** Check if any wearable has been connected (cookie set by the OAuth callback) */
function hasWearableCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_KEY}=1`));
}

/** Send the browser into the OAuth flow for the given provider */
function startOAuth(provider: Provider) {
  if (typeof window === "undefined") return;
  // Full page navigation so the 307 redirect → provider works correctly
  window.location.href = `/api/oauth/${provider}/start`;
}

export default function ConnectWearable() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState<Provider | null>(null);

  useEffect(() => {
    setConnected(hasWearableCookie());
  }, []);

  const handleConnect = (provider: Provider) => {
    setLoading(provider);
    startOAuth(provider);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-xs text-slate-200 shadow-lg shadow-slate-950/70">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400/40 via-violet-400/40 to-sky-400/40 p-[2px] shadow-lg shadow-violet-500/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950">
            <Watch className="h-4 w-4 text-sky-200" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Wearable Sync
          </p>
          <p className="text-xs text-slate-100">
            {connected
              ? "Your wearable is linked. We’ll quietly sync sleep, HRV, and steps to refine your rituals each day."
              : "Connect a wearable once, and FromWithin will flow in your sleep, HRV, and movement so insights feel deeply personal."}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleConnect("oura")}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200 transition hover:border-violet-400/80 hover:text-slate-50"
        >
          <Moon className="h-3.5 w-3.5 text-sky-300" />
          {loading === "oura" ? "Connecting…" : "Connect Oura"}
        </button>

        <button
          type="button"
          onClick={() => handleConnect("fitbit")}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200 transition hover:border-emerald-400/80 hover:text-slate-50"
        >
          <Activity className="h-3.5 w-3.5 text-emerald-300" />
          {loading === "fitbit" ? "Connecting…" : "Connect Fitbit"}
        </button>

        <button
          type="button"
          onClick={() => handleConnect("googlefit")}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200 transition hover:border-rose-400/80 hover:text-slate-50"
        >
          <HeartPulse className="h-3.5 w-3.5 text-rose-300" />
          {loading === "googlefit" ? "Connecting…" : "Connect Google Fit"}
        </button>
      </div>

      {/* Footer copy */}
      <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
        We only read the metrics you explicitly approve (sleep, HRV, heart rate,
        steps). Your data never leaves FromWithin and is used solely to help you
        understand your rhythms and nervous system.
      </p>
    </div>
  );
}
