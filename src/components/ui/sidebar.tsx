// src/components/ui/sidebar.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export function SidebarShell({ children }: { children: ReactNode }) {
  return (
    <aside className="w-64 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-bold flex items-center gap-1">
        <span>Guide Within</span>
        {/* dainty ankh */}
        <span aria-hidden className="ml-1 text-[12px] leading-none opacity-80">☥</span>
      </div>
      <nav className="px-2 space-y-1">{children}</nav>
    </aside>
  );
}

export function SidebarItem({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon?: ReactNode;
}) {
  const router = useRouter();
  const active = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition
        ${active ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
