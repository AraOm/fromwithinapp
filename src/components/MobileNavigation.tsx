import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Item = { href: string; label: string; Icon: React.FC<{ active?: boolean }> };

const IconStroke: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p} />
);

const Pen: Item["Icon"] = ({ active }) => (
  <IconStroke className={active ? "opacity-100" : "opacity-80"}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></IconStroke>
);
const HeartBook: Item["Icon"] = ({ active }) => (
  <IconStroke className={active ? "opacity-100" : "opacity-80"}><path d="M4 19.5V5a2 2 0 0 1 2-2h10" /><path d="M20 22V5a2 2 0 0 0-2-2H6" /><path d="M12 8c-.8-1.6-3-1.6-3.8 0-.6 1.2 0 2.7 1.8 3.9 1.8-1.2 2.4-2.7 1.9-3.9Z" /></IconStroke>
);
const Wave: Item["Icon"] = ({ active }) => (
  <IconStroke className={active ? "opacity-100" : "opacity-80"}><path d="M3 12s2-3 5-3 5 3 8 3 5-3 5-3" /><path d="M3 17s2-3 5-3 5 3 8 3 5-3 5-3" /></IconStroke>
);
const Mountain: Item["Icon"] = ({ active }) => (
  <IconStroke className={active ? "opacity-100" : "opacity-80"}><path d="m8 3 4 7 4-7" /><path d="M2 20h20L12 7Z" /></IconStroke>
);

const items: Item[] = [
  { href: "/checkin", label: "Check-In", Icon: Pen },
  { href: "/mentor", label: "Mentor", Icon: HeartBook },
  { href: "/wellbeing", label: "Body Insig...", Icon: Wave },
  { href: "/community", label: "Community", Icon: Mountain },
];

export default function MobileNavigation() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const path = mounted ? router.pathname : "";

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <ul className="mx-auto max-w-xl grid grid-cols-4 gap-1 p-3">
        {items.map(({ href, label, Icon }) => {
          const active = path === href;
          return (
            <li key={href} className="flex items-center justify-center">
              <Link href={href} className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl ${active ? "bg-neutral-200/70" : "hover:bg-neutral-100"}`}>
                <Icon active={active} />
                <span className="text-xs">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
