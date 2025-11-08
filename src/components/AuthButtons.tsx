// src/components/AuthButtons.tsx
"use client";

import React, { useEffect, useState } from "react";

const AUTH_KEY = "gw_is_signed_in";
const TRIAL_START_KEY = "gw_trial_started_at";
const SUB_KEY = "gw_is_subscribed";

const TRIAL_DAYS = 7;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getTrialInfo(startMs: number | null) {
  if (!startMs) {
    return { hasTrial: false, daysLeft: TRIAL_DAYS, expired: false };
  }
  const now = Date.now();
  const diffDays = Math.floor((now - startMs) / MS_PER_DAY);
  const daysLeft = Math.max(0, TRIAL_DAYS - diffDays);
  return {
    hasTrial: true,
    daysLeft,
    expired: daysLeft <= 0,
  };
}

export function AuthButtons() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialInfo, setTrialInfo] = useState<{
    hasTrial: boolean;
    daysLeft: number;
    expired: boolean;
  }>({ hasTrial: false, daysLeft: TRIAL_DAYS, expired: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const signed = window.localStorage.getItem(AUTH_KEY) === "true";
    const sub = window.localStorage.getItem(SUB_KEY) === "true";
    const trialStartRaw = window.localStorage.getItem(TRIAL_START_KEY);
    const trialStart = trialStartRaw ? parseInt(trialStartRaw, 10) : null;

    setIsSignedIn(signed);
    setIsSubscribed(sub);
    setTrialInfo(getTrialInfo(trialStart));
  }, []);

  const startTrial = () => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    window.localStorage.setItem(AUTH_KEY, "true");
    window.localStorage.setItem(TRIAL_START_KEY, String(now));
    setIsSignedIn(true);
    setTrialInfo(getTrialInfo(now));
  };

  const subscribe = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUB_KEY, "true");
    setIsSubscribed(true);
    alert("Pretend we opened Stripe and you subscribed 🌙");
  };

  const signIn = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AUTH_KEY, "true");
    setIsSignedIn(true);
  };

  const signOut = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(TRIAL_START_KEY);
    window.localStorage.removeItem(SUB_KEY);
    setIsSignedIn(false);
    setIsSubscribed(false);
    setTrialInfo({ hasTrial: false, daysLeft: TRIAL_DAYS, expired: false });
  };

  // Decide primary CTA text
  let primaryLabel = "Start 7-day free trial";
  let primaryOnClick: () => void = startTrial;

  if (!isSignedIn && trialInfo.hasTrial) {
    primaryLabel = "Resume trial";
    primaryOnClick = signIn;
  } else if (isSignedIn && !isSubscribed && trialInfo.hasTrial && !trialInfo.expired) {
    primaryLabel = "Subscribe";
    primaryOnClick = subscribe;
  } else if (isSignedIn && !isSubscribed && trialInfo.expired) {
    primaryLabel = "Subscribe";
    primaryOnClick = subscribe;
  } else if (isSignedIn && isSubscribed) {
    primaryLabel = "Manage plan";
    primaryOnClick = () => alert("Open billing portal in real app.");
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Primary CTA: Trial / Subscribe / Manage */}
      <button
        type="button"
        onClick={primaryOnClick}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-fuchsia-500/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <span>{primaryLabel}</span>
      </button>

      {/* Auth button */}
      {isSignedIn ? (
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/80 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Sign out
        </button>
      ) : (
        <button
          type="button"
          onClick={signIn}
          className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/80 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Sign in
        </button>
      )}
    </div>
  );
}
