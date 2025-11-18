"use client";

import React from "react";
import {
  Watch,
  Activity,
  HeartPulse,
  Moon,
  Smartphone,
} from "lucide-react";

type Provider = "fitbit" | "oura" | "googlefit" | "apple" | "garmin";

type ProviderConfig = {
  id: Provider;
  label: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ringClass: string;
  iconClass: string;
};

const providers: ProviderConfig[] = [
  {
    id: "fitbit",
    label: "Fitbit",
    subtitle: "Steps · Sleep · Heart",
    icon: Activity,
    ringClass: "border-teal-400/50 shadow-[0_0_14px_rgba(45,212,191,0.45)]",
    iconClass: "text-teal-300",
  },
  {
    id: "oura",
    label: "Oura",
    subtitle: "Sleep · HRV · Readiness",
    icon: Moon,
    ringClass: "border-violet-400/50 shadow-[0_0_14px_rgba(167,139,250,0.45)]",
    iconClass: "text-violet-300",
  },
  {
    id: "googlefit",
    label: "Google Fit",
    subtitle: "Android steps & heart",
    icon: HeartPulse,
    ringClass: "border-rose-400/50 shadow-[0_0_14px_rgba(251,113,133,0.45)]",
    iconClass: "text-rose-300",
  },
  {
    id: "apple",
    label: "Apple Health",
    subtitle: "iPhone · Apple Watch",
    icon: Smartphone,
    ringClass: "border-pink-400/50 shadow-[0_0_14px_rgba(244,114,182,0.45)]",
    iconClass: "text-pink-300",
  },
  {
    id: "garmin",
    label: "Garmin",
    subtitle: "Outdoor · Performance",
    icon: Watch,
    ringClass: "border-sky-400/50 shadow-[0_0_14px_rgba(56,189,248,0.45)]",
    iconClass: "text-sky-300",
  },
];

export default function ConnectWearable() {
  function connect(provider: Provider) {
    window.location.href = `/api/oauth/${provider}/start`;
  }

  return (
    <div className="w-full h-full rounded-3xl border border-slate-800/80 bg-slate-900/70 px-6 py-5 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/70 bg-slate-950/80 shadow-[0_0_26px_rgba(56,189,248,0.55)]">
              <Watch className="h-4 w-4 text-sky-300" />
            </div>
            <div className="pointer-events-none absolute -inset-1 rounded-full bg-sky-400/15 blur-xl" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.22em] text-slate-400 uppercase">
              Connect Wearable
            </p>
            <p className="text-[13px] text-slate-300">
              Sync sleep, HRV & movement from your devices.
            </p>
          </div>
        </div>
      </div>

      {/* Wearable Pills — now THINNER */}
      <div className="flex flex-wrap gap-2 mt-1">
        {providers.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => connect(p.id)}
              className="
                group flex items-center gap-2
                rounded-full border border-slate-700/70
                bg-slate-900/60
                px-3 py-[6px]   /* thinner height */
                text-left
                hover:border-sky-400/70 hover:bg-slate-900
                hover:shadow-[0_0_18px_rgba(56,189,248,0.28)]
                transition-all
              "
            >
              <span
                className={`
                  relative flex h-7 w-7 items-center justify-center 
                  rounded-full bg-slate-950/70 border border-slate-700/60
                  group-hover:border-slate-500/80
                  ${p.ringClass}
                `}
              >
                <Icon
                  className={`
                    h-[13px] w-[13px]   /* smaller icon */
                    ${p.iconClass}
                    group-hover:drop-shadow-[0_0_8px_rgba(248,250,252,0.7)]
                  `}
                />
              </span>

              <span className="flex flex-col">
                <span className="text-[12px] font-medium text-slate-100 leading-tight">
                  {p.label}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {p.subtitle}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Privacy line */}
      <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
        Data stays encrypted and private — used only to reflect your rhythms
        and nervous system back to you.
      </p>
    </div>
  );
}
