// src/components/Brand.tsx
import Link from "next/link";
import { APP_NAME, BRAND_MARK } from "@/lib/brand";

export default function Brand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Go to Home"
      className={`font-display text-xl sm:text-2xl leading-none inline-flex items-center gap-1 cursor-pointer ${className}`}
    >
      <span className="align-middle">{APP_NAME}</span>{" "}
      <span aria-hidden className="ankh align-middle">{BRAND_MARK}</span>
    </Link>
  );
}
