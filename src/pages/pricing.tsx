import React from "react";
import Head from "next/head";
import { SubscribeButtons } from "@/components/SubscribeButtons";

export default function PricingPage() {
  const userId = undefined; // replace with real auth later
  const email = undefined;

  return (
    <>
      <Head>
        <title>From Within — Pricing</title>
        <meta
          name="description"
          content="Begin a 7-day Mystic Path trial. Continue as Golden Lion, or choose ∞ Path lifetime access."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-14 md:px-8">

          {/* Header */}
          <header className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Choose Your Path
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold">
              Awakening begins from within.
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto text-[15px] leading-relaxed">
              Start your <span className="font-medium text-slate-200">Mystic Path</span> — a 7-day
              free trial. After your trial, continue as{" "}
              <span className="font-medium text-slate-200">Golden Lion</span> for{" "}
              <span className="font-medium text-slate-200">$11.11</span>/month — or unlock{" "}
              <span className="font-medium text-slate-200">∞ Path</span> for lifetime access.
            </p>
          </header>

          {/* Pricing Cards */}
          <section className="grid md:grid-cols-2 gap-6">

            {/* Golden Lion Plan */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              {/* Glow */}
              <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-blue-500" />

              <div className="space-y-2 relative">
                <h2 className="text-2xl font-semibold">Golden Lion</h2>
                <p className="text-slate-400 text-sm">Includes a 7-day “Mystic Path” trial.</p>

                <div className="pt-2">
                  <span className="text-4xl font-bold">$11.11</span>
                  <span className="text-slate-400"> / month</span>
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-300 relative">
                <li>• AI mentor & chakra insights</li>
                <li>• Aura scans, tarot & crystal grids</li>
                <li>• Energy calendar & daily rituals</li>
              </ul>

              <div className="mt-8 relative">
                <SubscribeButtons userId={userId} email={email} />
              </div>

              <p className="mt-3 text-xs text-slate-500 relative">
                Trial: Mystic Path (7 days). Then $11.11/month.
              </p>
            </div>

            {/* Infinity Path Plan */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-200/20 bg-white/5 backdrop-blur p-6">
              {/* Gold glow */}
              <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full blur-3xl opacity-30 bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500" />

              <div className="space-y-2 relative">
                <h2 className="text-2xl font-semibold">∞ Path (Lifetime)</h2>
                <p className="text-slate-400 text-sm">One-time purchase. Eternal access.</p>

                <div className="pt-2">
                  <span className="text-4xl font-bold">$333</span>
                  <span className="text-slate-400"> one-time</span>
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-300 relative">
                <li>• Everything in Golden Lion</li>
                <li>• Founder badge in-app</li>
                <li>• Early access to new features</li>
              </ul>

              <div className="mt-8 relative">
                <SubscribeButtons userId={userId} email={email} />
              </div>

              <p className="mt-3 text-xs text-slate-500 relative">
                Limited launch offer.
              </p>
            </div>
          </section>

          <p className="text-center text-xs text-slate-500">
            By starting a trial or purchasing lifetime access you agree to the Terms and acknowledge
            the Privacy Policy.
          </p>

        </div>
      </main>
    </>
  );
}
