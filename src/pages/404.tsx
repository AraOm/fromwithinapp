import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  React.useEffect(() => {
    // Useful for debugging which path 404'd
    // eslint-disable-next-line no-console
    console.error("404: attempted path ->", router.asPath);
  }, [router.asPath]);

  return (
    <div className="min-h-screen grid place-items-center bg-background p-8">
      <div className="text-center max-w-md rounded-lg border border-border bg-card shadow-md p-8">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-lg text-card-foreground mb-8">
          Page not found: <span className="font-mono">{router.asPath}</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition"
          >
            Home
          </Link>
          <Link
            href="/spiritual-mentor"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Spiritual Mentor
          </Link>
        </div>
      </div>
    </div>
  );
}
