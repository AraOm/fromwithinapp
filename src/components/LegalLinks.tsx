// components/LegalLinks.tsx
import Link from "next/link";

export default function LegalLinks() {
  return (
    <div className="mt-8 text-center text-xs text-slate-400">
      <Link href="/privacy" className="hover:text-slate-200 transition-colors">
        Privacy Policy
      </Link>
      {" • "}
      <Link href="/terms" className="hover:text-slate-200 transition-colors">
        Terms of Use
      </Link>
    </div>
  );
}
