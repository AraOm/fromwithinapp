// src/components/ConnectWearable.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Watch, Activity, MoonStar, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProviderKey = "fitbit" | "oura" | "apple_health" | "google_fit";

type ProviderConfig = {
  key: ProviderKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
};

const PROVIDERS: ProviderConfig[] = [
  {
    key: "fitbit",
    label: "Fitbit",
    description: "Sync heart rate, HRV, steps, and movement.",
    icon: <Activity className="h-4 w-4" />,
    available: true, // wired via /api/wearables/fitbit/*
  },
  {
    key: "oura",
    label: "Oura Ring",
    description: "Deep sleep + HRV insights for nervous system balance.",
    icon: <MoonStar className="h-4 w-4" />,
    available: true, // wired via /api/wearables/oura/*
  },
  {
    key: "google_fit",
    label: "Google Fit / Android",
    description: "Connect Android-based health data (HR, sleep, activity).",
    icon: <Smartphone className="h-4 w-4" />,
    available: true, // wired via /api/wearables/google_fit/*
  },
  {
    key: "apple_health",
    label: "Apple Health / Apple Watch",
    description: "Coming soon – sync data from your iPhone and Apple Watch.",
    icon: <Watch className="h-4 w-4" />,
    available: false, // future native HealthKit integration
  },
];

export const ConnectWearable: React.FC = () => {
  const [isOpening, setIsOpening] = useState<ProviderKey | null>(null);

  const handleConnect = (provider: ProviderKey, available: boolean) => {
    if (!available) {
      alert(
        "Apple Health / Apple Watch syncing is coming in a later update.\n\nFor now, you can connect Fitbit, Oura, or Google Fit."
      );
      return;
    }
  
    setIsOpening(provider);
  
    if (provider === "fitbit") {
      window.location.href = "/api/wearables/fitbit/auth";
    } else if (provider === "oura") {
      window.location.href = "/api/wearables/oura/auth";
    } else if (provider === "google_fit") {
      window.location.href = "/api/wearables/google_fit/auth";
    }
    // apple_health will be handled by the native iOS app later
  };  

  const openingLabel =
    isOpening === "fitbit"
      ? "Fitbit"
      : isOpening === "oura"
      ? "Oura"
      : isOpening === "google_fit"
      ? "Google Fit"
      : isOpening === "apple_health"
      ? "Apple Health"
      : "provider";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-sm font-medium text-white shadow-lg shadow-purple-500/40 hover:from-purple-400 hover:via-pink-400 hover:to-blue-400"
        >
          <Watch className="h-4 w-4" />
          Connect your wearable
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-50">
            Connect your body data
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            FromWithin translates your heart, breath, and sleep into energy
            insights. Choose the wearable (or app) you use most.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.key}
              onClick={() => handleConnect(p.key, p.available)}
              disabled={!p.available}
              className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                p.available
                  ? "border-slate-700 bg-slate-900/80 hover:border-purple-500 hover:bg-slate-900"
                  : "cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80">
                  {p.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-100">
                    {p.label}
                    {!p.available && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {p.description}
                  </p>
                </div>
              </div>

              {p.available && (
                <span className="text-[11px] uppercase tracking-wide text-purple-300">
                  Connect
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
          We&apos;ll never share your health data. It&apos;s encrypted and used
          only to help you understand your nervous system, emotional energy, and
          daily rhythms.
        </p>

        {isOpening && (
          <p className="mt-2 text-[11px] text-slate-400">
            Opening {openingLabel}…
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
