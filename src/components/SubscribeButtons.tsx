import React, { useState } from "react";

type Plan = "golden" | "infinity";

export function SubscribeButtons({
  userId,
  email,
}: {
  userId?: string;
  email?: string;
}) {
  const [loading, setLoading] = useState<Plan | null>(null);

  async function startCheckout(plan: Plan) {
    try {
      setLoading(plan);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId, email }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || "Unable to start checkout. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Golden Lion – subscription with 7-day Mystic Path trial */}
      <button
        onClick={() => startCheckout("golden")}
        disabled={loading !== null}
        className="rounded-2xl px-5 py-3 font-medium shadow-lg bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10"
      >
        {loading === "golden"
          ? "Starting trial…"
          : "Start 7-Day Mystic Path → Golden Lion ($11.11/mo)"}
      </button>

      {/* ∞ Path – lifetime one-time payment */}
      <button
        onClick={() => startCheckout("infinity")}
        disabled={loading !== null}
        className="rounded-2xl px-5 py-3 font-medium shadow-lg bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10"
      >
        {loading === "infinity"
          ? "Opening checkout…"
          : "∞ Path — Lifetime Access ($333)"}
      </button>
    </div>
  );
}
