// src/components/MobileHeader.tsx
import React from "react";
import Link from "next/link";
import { APP_NAME, BRAND_MARK } from "@/lib/brand";

export default function MobileHeader() {
  return (
    <header
      className="site-header sticky top-0 z-30 w-full border-b border-white/10 bg-[#120027]/80 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto max-w-screen-md px-4">
        <div className="flex h-14 items-center justify-center">
          <Link
            href="/"
            prefetch={false}
            className="rounded-lg px-1 focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Go to Home"
          >
            <span className="font-display text-xl sm:text-2xl leading-none align-middle text-violet-50">
              {APP_NAME}
            </span>{" "}
            <span aria-hidden className="ankh align-middle text-violet-100">
              {BRAND_MARK}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
