// Works without extra deps. Drop-in for shadcn's cn()
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | Record<string, boolean>
  | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  const out: string[] = [];
  const push = (v: ClassValue): void => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") out.push(String(v));
    else if (Array.isArray(v)) v.forEach(push);
    else if (typeof v === "object")
      for (const k in v) if ((v as Record<string, boolean>)[k]) out.push(k);
  };
  inputs.forEach(push);
  return out.join(" ");
}
