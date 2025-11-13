import Link from "next/link";

export default function Welcome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        {/* HEADLINE */}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight whitespace-nowrap mx-auto">
          Self-awareness begins in stillness.
        </h1>

        {/* SUBTEXT */}
        <p className="mt-6 text-slate-400 leading-relaxed text-lg whitespace-nowrap mx-auto">
          From Within fuses intelligent technology with intuitive wisdom — aligning your energy, emotions, and purpose.
        </p>

        {/* CLOSING LINE */}
        <p className="mt-4 text-slate-300 text-base md:text-lg whitespace-nowrap mx-auto">
          Awaken from within. 🌙
        </p>

        {/* CTA BUTTON + PRICING LINK */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link
            href="/onboarding"
            className="rounded-2xl px-6 py-3 text-lg font-medium shadow-[0_0_60px_rgba(168,85,247,0.35)] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
          >
            Start 7-day free trial & connect wearable
          </Link>

          <p className="text-xs text-slate-500 whitespace-nowrap">
            Requires Apple Health, Fitbit, Oura, or Google Fit • 7 days free, then $11.11/month.
          </p>

          {/* NEW: link to pricing structure */}
          <Link
            href="/pricing"
            className="mt-2 text-xs text-slate-300 underline underline-offset-4 hover:text-slate-100"
          >
            See full pricing (Golden Lion & ∞ Path)
          </Link>
        </div>

        {/* FOOTER LINKS */}
        <div className="mt-10 text-xs text-slate-500">
          <Link href="/legal/privacy">Privacy</Link> •{" "}
          <Link href="/legal/terms">Terms</Link> •{" "}
          <Link href="/legal/medical">Medical</Link>
        </div>
      </section>
    </main>
  );
}
