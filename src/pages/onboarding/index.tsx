// src/pages/onboarding/index.tsx
import { useEffect, useState } from "react";

type Provider = "fitbit" | "oura" | "googlefit";

export default function Onboarding() {
  const [connected, setConnected] = useState(false);

  // Enable the button after OAuth sets the cookie
  useEffect(() => {
    const has = document.cookie
      .split("; ")
      .some((c) => c.startsWith("gw_wearable_connected=1"));
    setConnected(has);
  }, []);

  function connect(provider: Provider) {
    window.location.href = `/api/oauth/${provider}/start`;
  }

  // Golden Lion plan (Mystic Path 7-day trial)
  async function startTrial() {
    const resp = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "golden" }),
    });

    const json = await resp.json();
    if (json.url) window.location.href = json.url;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-12">

        {/* UPDATED HEADLINE */}
        <h1 className="text-3xl font-semibold">
          Self-awareness begins in stillness.
        </h1>

        {/* UPDATED SUBTEXT */}
        <p className="mt-3 text-slate-400 leading-relaxed">
          From Within fuses intelligent technology with intuitive wisdom —
          aligning your energy, emotions, and purpose.
          <br /><br />
          The ultimate guide isn’t an app.
          <br />
          It’s you — awakened from within. 🌙
        </p>

        {/* Wearable choices */}
        <section className="mt-10 grid gap-4 md:grid-cols-4">

          {/* Apple Health (disabled for now) */}
          <button
            disabled
            className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left opacity-60 cursor-not-allowed"
            title="Connect from iPhone app (coming soon)"
          >
            <div className="text-lg">Apple Health</div>
            <div className="text-xs text-slate-400 mt-1">
              iPhone only • Coming soon
            </div>
          </button>

          {/* Fitbit */}
          <button
            onClick={() => connect("fitbit")}
            className="rounded-2xl border border-slate-700 p-4 text-left hover:border-slate-500"
          >
            <div className="text-lg">Fitbit</div>
            <div className="text-xs text-slate-400 mt-1">Connect securely</div>
          </button>

          {/* Oura */}
          <button
            onClick={() => connect("oura")}
            className="rounded-2xl border border-slate-700 p-4 text-left hover:border-slate-500"
          >
            <div className="text-lg">Oura</div>
            <div className="text-xs text-slate-400 mt-1">Connect securely</div>
          </button>

          {/* Google Fit */}
          <button
            onClick={() => connect("googlefit")}
            className="rounded-2xl border border-slate-700 p-4 text-left hover:border-slate-500"
          >
            <div className="text-lg">Google Fit</div>
            <div className="text-xs text-slate-400 mt-1">Connect securely</div>
          </button>
        </section>

        {/* Continue to Stripe */}
        <div className="mt-10">
          <button
            disabled={!connected}
            onClick={startTrial}
            className="rounded-2xl px-6 py-3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 shadow-[0_0_60px_rgba(168,85,247,0.35)] disabled:opacity-50"
          >
            Continue to 7-day Mystic Path trial
          </button>

          {/* UPDATED REQUIREMENTS TEXT */}
          <p className="mt-3 text-xs text-slate-500">
            Requires Apple Health, Fitbit, Oura, or Google Fit • 7 days free, then $11.11/month.
          </p>
        </div>

      </div>
    </main>
  );
}
