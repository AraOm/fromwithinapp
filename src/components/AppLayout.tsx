import Link from "next/link";
import React from "react";

type Props = { children: React.ReactNode };

export default function AppLayout({ children }: Props) {
  return (
    // ❌ was bg-white
    <div className="min-h-screen flex flex-col text-gray-50">
      {/* Top bar with title */}
      <header className="site-header sticky top-0 z-30">
        {/* Add a soft, translucent bar so the gradient still shows */}
        <div className="bg-[#120027]/70 backdrop-blur-md border-b border-white/10">
          <div className="h-14 max-w-6xl mx-auto px-4 flex items-center justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl leading-none"
            >
              <span className="font-canto">From&nbsp;Within</span>
              <span className="ankh" aria-hidden>
              
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page content with scroll */}
      <main className="flex-1">
        <div className="safe-bottom">{children}</div>
      </main>
    </div>
  );
}
