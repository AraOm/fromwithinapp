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
        <title>{DEFAULT_SEO.title}</title>
        <meta name="description" content={DEFAULT_SEO.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="grid min-h-dvh grid-rows-[auto,1fr,auto] bg-white text-gray-900">
        <MobileHeader />
        <main className="overflow-y-auto safe-bottom">
          <Component {...pageProps} />
        </main>
        <BottomNav />
      </div>
    </>
  );
}
