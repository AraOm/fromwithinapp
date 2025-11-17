"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useLayoutEffect, useRef } from "react";
import LegalLinks from "./LegalLinks"; // ✅ NEW: tiny Privacy & Terms row

type ItemProps = { href: string; label: string; icon: React.ReactNode };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const Item: React.FC<ItemProps> = ({ href, label, icon }) => {
  const { pathname, asPath } = useRouter();
  const isActive =
    pathname === href ||
    asPath === href ||
    (href !== "/" &&
      (pathname.startsWith(href + "/") || asPath.startsWith(href + "/")));

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={cx(
        "flex-none w-20 sm:w-24 md:flex-1",
        "flex flex-col items-center justify-center py-2",
        "text-xs select-none outline-none",
        "transition-[color,transform] duration-150 ease-out",
        "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-xl",
        isActive
          ? "font-semibold text-violet-50"
          : "text-violet-200/80 hover:text-violet-50",
      )}
    >
      <div
        className={cx(
          "mb-1 text-2xl leading-none not-italic",
          isActive
            ? "translate-y-[-1px]"
            : "hover:translate-y-[-1px] active:translate-y-0",
          "transition-transform duration-150 ease-out",
        )}
      >
        {icon}
      </div>
      <span className="leading-none text-center">{label}</span>
    </Link>
  );
};

export default function BottomNav() {
  // NEW: 6 items including Beta Feedback
  const items: ItemProps[] = [
    { href: "/today", label: "Today", icon: <span aria-hidden>☀️</span> },
    { href: "/guide", label: "Guide", icon: <span aria-hidden>🜃</span> },
    { href: "/insights", label: "Insights", icon: <span aria-hidden>﹏</span> },
    {
      href: "/community",
      label: "Community",
      icon: <span aria-hidden>ૐ</span>,
    },
    { href: "/studio", label: "Studio", icon: <span aria-hidden>𓁿</span> },

    // ⭐ NEW TILE — Beta Feedback
    {
      href: "/beta-feedback",
      label: "Feedback",
      icon: <span aria-hidden>🧪</span>,
    },
  ];

  // Measure the nav (including safe-area padding) and publish it to --tabbar-h
  const navRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const setVar = () => {
      const h = Math.ceil(el.offsetHeight);
      document.documentElement.style.setProperty("--tabbar-h", `${h}px`);
    };
    setVar();
    const RO = (window as any).ResizeObserver;
    const ro = RO ? new RO(setVar) : null;
    ro?.observe(el);
    window.addEventListener("resize", setVar);
    window.addEventListener("orientationchange", setVar);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", setVar);
      window.removeEventListener("orientationchange", setVar);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Bottom Navigation"
      role="navigation"
      className={cx(
        "fixed bottom-0 left-0 right-0 z-20",
        "min-h-16",
        // 🔮 purple glass instead of white
        "border-t border-white/10 bg-[#120027]/85 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur",
        "shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.6)]",
        "px-2",
      )}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
    >
      {/* ✅ Tiny Privacy / Terms row, sits just above the icons */}
      <LegalLinks />

      <div
        className={cx(
          "relative mx-auto max-w-screen-md",
          "flex gap-2 overflow-x-auto px-1 py-0.5 items-center",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((it) => (
          <Item key={it.href} {...it} />
        ))}

        {/* Edge fades match purple bar */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#120027]/85 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#120027]/85 to-transparent" />
      </div>
    </nav>
  );
}
