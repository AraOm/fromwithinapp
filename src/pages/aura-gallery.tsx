// src/pages/aura-gallery.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type AuraRow = {
  id: string;
  created_at: string;
  image_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  intensity: number | null;
  reading: string | null;
};

export default function AuraGalleryPage() {
  const [auras, setAuras] = useState<AuraRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUser, setHasUser] = useState<boolean | null>(null);

  useEffect(() => {
    const loadAuras = async () => {
      setLoading(true);
      setError(null);

      // 1) Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Supabase auth error:", userError);
        setError("Problem checking your session. Try signing out and in again.");
        setLoading(false);
        setHasUser(false);
        return;
      }

      if (!user) {
        setHasUser(false);
        setLoading(false);
        return;
      }

      setHasUser(true);

      // 2) Load that user's auras
      const { data, error } = await supabase
        .from("auras")
        .select(
          "id, created_at, image_url, primary_color, secondary_color, intensity, reading"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase auras load error:", error);
        setError("Could not load your aura history.");
      } else if (data) {
        setAuras(data);
      }

      setLoading(false);
    };

    void loadAuras();
  }, []);

  return (
    <main className="mx-auto max-w-screen-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Aura Gallery</h1>
          <p className="mt-2 text-gray-600">
            A living archive of your aura readings — colors, messages, and
            moments in time.
          </p>
        </div>

        <Link
          href="/aura"
          className="text-sm underline underline-offset-4 text-gray-800"
        >
          + New Aura
        </Link>
      </header>

      {loading && (
        <p className="text-sm text-gray-600">Gathering your light history…</p>
      )}

      {!loading && hasUser === false && (
        <p className="text-sm text-gray-600">
          You&apos;re not signed in, so we can&apos;t show your saved auras.
          Sign in, then come back here to view your gallery.
        </p>
      )}

      {!loading && hasUser && auras.length === 0 && (
        <p className="text-sm text-gray-600">
          No auras saved yet. Once you take a few readings, they&apos;ll appear
          here in a glowing timeline.
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Aura cards */}
      <section className="mt-4 grid gap-4 md:grid-cols-2">
        {auras.map((aura) => {
          const primary = aura.primary_color || "#7F5AF0";
          const secondary = aura.secondary_color || "#FFB3C6";
          const intensity = aura.intensity ?? 0.7;

          const created = new Date(aura.created_at);
          const dateLabel = created.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const timeLabel = created.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          });

          const gradientStyle = {
            backgroundImage: `
              radial-gradient(circle at 15% 10%, ${primary}D9, transparent 55%),
              radial-gradient(circle at 85% 90%, ${secondary}CC, transparent 60%)
            `,
            opacity: intensity,
          };

          return (
            <article
              key={aura.id}
              className="relative overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              {/* aura background stripe */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={gradientStyle} />
              </div>

              <div className="relative z-10 p-4 flex flex-col gap-3">
                <header className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {dateLabel}
                    </p>
                    <p className="text-[11px] text-gray-500">{timeLabel}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-700">
                    <span
                      className="h-3 w-3 rounded-full border border-white"
                      style={{ background: primary }}
                    />
                    <span
                      className="h-3 w-3 rounded-full border border-white"
                      style={{ background: secondary }}
                    />
                    <span>{Math.round(intensity * 100)}%</span>
                  </div>
                </header>

                {aura.image_url && (
                  <div className="overflow-hidden rounded-xl border bg-black/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={aura.image_url}
                      alt="Aura snapshot"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                {aura.reading && (
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {aura.reading}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-6">
        <Link
          href="/play"
          className="text-sm underline underline-offset-4 text-gray-800"
        >
          ← Back to Play
        </Link>
      </div>
    </main>
  );
}
