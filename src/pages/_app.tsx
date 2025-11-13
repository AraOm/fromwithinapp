// src/pages/_app.tsx
import "@/styles/index.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { DEFAULT_SEO } from "@/lib/brand";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Use your shared brand SEO */}
        <title>{DEFAULT_SEO.title}</title>
        <meta name="description" content={DEFAULT_SEO.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Extra polish: theme + social share basics */}
        <meta name="theme-color" content="#020617" />
        <meta property="og:title" content={DEFAULT_SEO.title} />
        <meta property="og:description" content={DEFAULT_SEO.description} />
        <meta property="og:type" content="website" />

        {/* Favicon + touch icon (you can swap these files later) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="grid min-h-dvh grid-rows-[auto,auto,1fr,auto] bg-white text-gray-900">
        {/* Existing mobile header */}
        <MobileHeader />

        {/* New beta banner */}
        <div className="w-full border-b border-slate-200 bg-slate-900/80 backdrop-blur">
          <p className="mx-auto max-w-5xl px-4 py-2 text-center text-xs md:text-sm text-slate-100/90">
            ✨ <span className="font-semibold">From Within</span> is in{" "}
            <span className="uppercase tracking-wide">beta</span>. Things may still
            shift and glow. Spot something weird? Email{" "}
            <a
              href="mailto:fromwithinapp@gmail.com"
              className="underline decoration-sky-400/80 underline-offset-2"
            >
              hello@fromwithin.com
            </a>
            .
          </p>
        </div>

        {/* Main content */}
        <main className="overflow-y-auto safe-bottom">
          <Component {...pageProps} />
        </main>

        {/* Bottom navigation */}
        <BottomNav />
      </div>
    </>
  );
}
