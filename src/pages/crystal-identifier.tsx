"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera, Sparkles, AlertCircle } from "lucide-react";

type CrystalResult = {
  crystalName: string;
  chakra: string;
  uses: string;
};

export default function CrystalIdentifier() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrystalResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
      identifyCrystal(base64);
    };
    reader.readAsDataURL(file);
  };

  const identifyCrystal = async (base64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/crystal-identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: base64 }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", res.status, text);
        setError(
          res.status === 413
            ? "Image is too large. Try a smaller photo or screenshot."
            : "Server error while identifying your crystal."
        );
        return;
      }

      const data = (await res.json()) as CrystalResult | { error: string };

      if ("error" in data) {
        setError(data.error || "Something went wrong identifying your crystal.");
      } else {
        setResult(data as CrystalResult);
      }
    } catch (err) {
      console.error("Client error identifying crystal:", err);
      setError("Unable to reach the crystal guide. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-6 md:px-8 md:pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/play"
            className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back Home
          </Link>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Crystals & Chakras
            </p>
            <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-xl font-semibold text-transparent md:text-2xl">
              Crystal Identifier
            </h1>
          </div>
        </div>

        {/* Main panel */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950/80 to-slate-900/90 px-4 py-6 shadow-2xl md:px-8 md:py-8">
          {/* Glow accents */}
          <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
            {/* Left: uploader */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h2 className="text-2xl font-semibold text-slate-50">
                  Upload a crystal photo
                </h2>
              </div>
              <p className="mb-6 max-w-xl text-sm text-slate-300">
                Choose a clear photo of your crystal. I&apos;ll tune into its
                energy, identify the stone, and share its chakra alignment and
                key uses.
              </p>

              {/* Upload box */}
              <label
                htmlFor="crystal-upload"
                className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-10 text-center transition hover:border-violet-500/60 hover:bg-slate-900/80"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-500/5 via-fuchsia-500/0 to-sky-500/10 opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {/* Gradient camera button */}
                  <div className="rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-400 to-sky-400 p-[2px] shadow-lg shadow-violet-500/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950">
                      <Camera className="h-7 w-7 text-slate-50" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      Click to upload a photo
                    </p>
                    <p className="text-xs text-slate-400">
                      JPG, PNG up to ~10MB
                    </p>
                  </div>
                </div>
              </label>

              <input
                id="crystal-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Action + status */}
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => image && identifyCrystal(image)}
                  disabled={!image || loading}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-400 to-sky-400 px-6 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Reading your crystal..." : "Read My Crystal"}
                </button>

                {loading && (
                  <p className="text-xs text-slate-400">
                    Tuning into the stone&apos;s frequency…
                  </p>
                )}

                {error && (
                  <div className="mt-2 inline-flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: preview + result */}
            <div className="space-y-4">
              {/* Image preview */}
              {image && (
                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl">
                  <Image
                    src={image}
                    alt="Crystal preview"
                    width={600}
                    height={800}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* Result card */}
              {result && !error && (
                <div className="rounded-3xl border border-violet-500/40 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-sky-500/20 p-5 text-sm text-slate-50 shadow-xl">
                  <h3 className="mb-2 text-xl font-semibold text-violet-100">
                    {result.crystalName}
                  </h3>
                  <p className="mb-1">
                    <span className="font-semibold text-violet-50">
                      Chakra:
                    </span>{" "}
                    {result.chakra}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-violet-50">
                      Uses:
                    </span>{" "}
                    {result.uses}
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 text-xs font-medium text-sky-200 hover:text-sky-100"
                  >
                    Try another crystal
                  </button>
                </div>
              )}

              {!image && !result && (
                <p className="text-xs text-slate-500">
                  Once you upload a photo, I&apos;ll display your crystal and
                  its reading here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
