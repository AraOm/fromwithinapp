// src/pages/aura.tsx
import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type AuraResponseBody = {
  primaryColor: string;
  secondaryColor: string;
  intensity: number; // 0–1
  reading: string;
  angelNumbers?: string[];
  keywords?: string[];
};

// Helper: convert a File to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error || new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

// Map angel codes → meanings
const getAngelMeaning = (code: string): string => {
  switch (code) {
    case "111":
      return "fresh starts, alignment with your intentions, and saying yes to the new timeline calling you forward.";
    case "222":
      return "balance, partnership, and trusting that things are coming together behind the scenes even if you can’t see it yet.";
    case "333":
      return "spirit guides and helpers around you, creative expression, and being supported as you speak your truth.";
    case "444":
      return "deep protection, stable foundations, and being held while you do the slow, steady work of building your next chapter.";
    case "555":
      return "big change, upgrades, and saying yes to more freedom—even if it feels a little chaotic at first.";
    case "666":
      return "realigning with what truly matters, rebalancing your energy, and tending to your body, home, and nervous system.";
    case "777":
      return "spiritual intuition, mystical insight, and trusting your inner knowing even when it doesn’t make logical sense yet.";
    case "888":
      return "abundance, energetic reciprocity, and opening to receive more support, resources, and ease.";
    case "999":
      return "completion, soul-level closure, and graduating from an old cycle so you can step into your next evolution.";
    default:
      return "a gentle nudge from the universe to pay attention to the little patterns, whispers, and synchronicities around you.";
  }
};

const AuraPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aura, setAura] = useState<AuraResponseBody | null>(null);
  const [angelNumber, setAngelNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAura(null);
    setAngelNumber(null);
    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const getAngelNumberFromIntensity = (intensity: number): string => {
    if (intensity >= 0.85) return "999";
    if (intensity >= 0.65) return "888";
    if (intensity >= 0.45) return "777";
    if (intensity >= 0.3) return "444";
    return "222";
  };

  const handleAnalyzeAura = async () => {
    if (!selectedFile) {
      setError("Please upload a photo first 🌈");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Turn image into base64 string
      const imageData = await fileToBase64(selectedFile);

      // 2. Call your API route
      const res = await fetch("/api/aura-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });

      if (!res.ok) {
        let message = "Failed to get aura reading";
        try {
          const body = await res.json();
          if (body?.error) message = body.error;
        } catch {
          // ignore JSON parse error, keep default message
        }
        throw new Error(message);
      }

      const data: AuraResponseBody = await res.json();
      setAura(data);

      const angel = getAngelNumberFromIntensity(data.intensity);
      setAngelNumber(angel);

      // 3. (Optional) Save to Supabase gallery – non-blocking
      try {
        await supabase.from("aura_readings").insert({
          primary_color: data.primaryColor,
          secondary_color: data.secondaryColor,
          intensity: data.intensity,
          reading: data.reading,
          angel_number: angel,
          created_at: new Date().toISOString(),
        });
      } catch (supabaseError: any) {
        console.warn(
          "Supabase insert failed:",
          supabaseError?.message || supabaseError
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong reading the aura.");
    } finally {
      setIsLoading(false);
    }
  };

  const angelMeaning = angelNumber ? getAngelMeaning(angelNumber) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-800/70 bg-black/40 backdrop-blur-md">
        <Link
          href="/"
          className="text-sm sm:text-base text-slate-300 hover:text-slate-100 transition-colors"
        >
          ← Back Home
        </Link>

        <h1 className="text-lg sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-sky-400 bg-clip-text text-transparent">
          Aura & Angel Codes
        </h1>

        <Link
          href="/aura-gallery"
          className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-amber-300/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 shadow-lg shadow-amber-500/25 transition-all"
        >
          View Gallery
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
          {/* Upload + Button */}
          <section className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Upload a photo for your aura reading
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Choose a clear photo of yourself. I’ll generate a vibrant aura field and interpret
                the energy, plus show you a highlighted angel code.
              </p>
            </div>

            <label
              htmlFor="aura-upload"
              className="block cursor-pointer rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 hover:bg-slate-900/90 transition-all p-6 sm:p-8 flex flex-col items-center justify-center gap-3 text-center"
            >
              <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 via-pink-500 to-sky-500 flex items-center justify-center shadow-xl shadow-amber-500/40">
                <span className="text-2xl">📸</span>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm sm:text-base">
                  Click to upload a photo
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  JPG, PNG up to ~10MB
                </p>
              </div>
              <input
                id="aura-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Gradient pill button */}
            <button
              onClick={handleAnalyzeAura}
              disabled={!selectedFile || isLoading}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm sm:text-base font-medium bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 text-slate-950 shadow-2xl shadow-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              {isLoading ? "Reading your aura..." : "Read My Aura"}
            </button>

            {error && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 text-red-100 text-sm px-4 py-3">
                {error}
              </div>
            )}

            {!error && aura && (
              <div className="mt-4 rounded-3xl border border-slate-700/80 bg-slate-900/70 p-5 sm:p-6 space-y-3">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <span className="text-amber-300 text-lg">✧</span>
                  Aura Interpretation
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {aura.reading}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-600/70 text-slate-100">
                    Primary:{" "}
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: aura.primaryColor }}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: aura.primaryColor }}
                      />
                      {aura.primaryColor}
                    </span>
                  </span>
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-600/70 text-slate-100">
                    Secondary:{" "}
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: aura.secondaryColor }}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: aura.secondaryColor }}
                      />
                      {aura.secondaryColor}
                    </span>
                  </span>
                  <span className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-600/70 text-slate-100">
                    Intensity:{" "}
                    <span className="font-semibold">
                      {(aura.intensity * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Preview + Aura / Angel number */}
          <section className="space-y-4">
            <div className="relative rounded-3xl border border-slate-700/80 bg-slate-950/80 p-4 sm:p-5 overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-center justify-center">
              {/* No outer aura frame here – just a dark card */}

              {previewUrl ? (
                <div className="relative w-full max-w-md mx-auto">
                  {/* Photo card with aura only INSIDE the image */}
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-black/70">
                    <img
                      src={previewUrl}
                      alt="Uploaded aura subject"
                      className="w-full h-full object-cover"
                    />

                    {/* Inner aura overlay: vivid but confined to the photo */}
                    {aura && (
                      <div
                        className="pointer-events-none absolute inset-0 opacity-95 mix-blend-soft-light"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 20% 0%, ${aura.primaryColor}dd, transparent 55%),
                            radial-gradient(circle at 80% 100%, ${aura.secondaryColor}cc, transparent 60%)
                          `,
                        }}
                      />
                    )}

                    {/* Angel number badge – inside the photo, near the bottom */}
                    {angelNumber && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="rounded-full border border-amber-300 bg-black/90 px-6 py-2 shadow-[0_0_25px_rgba(250,204,21,0.95)]">
                          <div className="flex flex-col items-center leading-tight">
                            <span className="text-[0.7rem] tracking-[0.28em] uppercase text-amber-100">
                              Angel
                            </span>
                            <span className="mt-0.5 text-3xl font-semibold text-amber-200 angel-number-glow">
                              {angelNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-3 text-slate-300">
                  <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center shadow-inner">
                    <span className="text-3xl">✨</span>
                  </div>
                  <p className="text-sm sm:text-base max-w-xs">
                    Your aura preview will appear here once you upload a photo and tap{" "}
                    <span className="font-semibold text-amber-300">Read My Aura</span>.
                  </p>
                </div>
              )}
            </div>

            {angelNumber && (
              <div className="rounded-3xl border border-amber-300/40 bg-amber-500/10 px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-xs sm:text-sm text-amber-100">
                  Your highlighted angel code is{" "}
                  <span className="font-semibold text-amber-200">{angelNumber}</span>
                  {angelMeaning && (
                    <>
                      , which speaks to{" "}
                      <span className="font-medium text-amber-100">
                        {angelMeaning}
                      </span>
                    </>
                  )}
                  {" "}You can journal on how this pattern is showing up for you today and save this reading in
                  your gallery.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AuraPage;
