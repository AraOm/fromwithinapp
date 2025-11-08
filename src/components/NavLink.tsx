import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
};

export default function NavLink({ href, children, exact = false, className = "" }: Props) {
  const router = useRouter();
  const isActive = exact ? router.pathname === href : router.pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "block rounded px-2 py-2 transition",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/10",
        isActive ? "bg-gray-100 font-semibold" : "text-gray-700",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
