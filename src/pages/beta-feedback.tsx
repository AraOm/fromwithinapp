// src/pages/beta-feedback.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function BetaFeedbackPage() {
  const [issueType, setIssueType] = useState("bug");
  const [page, setPage] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/beta-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueType,
          page,
          description,
          email,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setPage("");
      setDescription("");
      // keep email + type for convenience
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-flex text-sm text-slate-400 hover:text-slate-100"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">
            Beta Feedback
          </h1>
          <p className="text-slate-400 text-sm">
            Thank you for helping shape FromWithin. Use this form any time you
            hit a bug, something feels confusing, or you have an idea.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/40 backdrop-blur">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Issue type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                What are you sharing?
              </label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { value: "bug", label: "🐛 Bug / broken" },
                  { value: "confusing", label: "🤔 Confusing UX" },
                  { value: "idea", label: "✨ Feature idea" },
                  { value: "other", label: "📝 Other" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIssueType(opt.value)}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      issueType === opt.value
                        ? "border-emerald-400/80 bg-emerald-500/10"
                        : "border-slate-700/80 bg-slate-900/60 hover:border-slate-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page / screen */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200" htmlFor="page">
                Where were you in the app?
              </label>
              <input
                id="page"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="e.g. Morning Ritual → Breath, Energy Calendar month view, Golden Lion Mentor chat…"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-slate-200"
                htmlFor="description"
              >
                What happened?
              </label>
              <textarea
                id="description"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="Tell me what you expected, what actually happened, and any steps to reproduce it."
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200" htmlFor="email">
                Email (optional)
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                placeholder="So we can follow up if needed"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Status message */}
            {status === "success" && (
              <p className="text-sm text-emerald-400">
                Thank you — your feedback has been sent. 🦁
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-rose-400">
                Something went wrong sending this. Please try again in a minute.
              </p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !description}
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {submitting ? "Sending..." : "Send feedback"}
              </button>
            </div>
          </form>
        </section>

        <p className="text-xs text-slate-500">
          Your feedback is only used to improve FromWithin during beta. No spam,
          no sharing.
        </p>
      </div>
    </main>
  );
}
