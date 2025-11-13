import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    const t = setTimeout(() => (window.location.href = "/home"), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 text-slate-100">
      <p className="text-lg">Trial started — redirecting…</p>
    </main>
  );
}
