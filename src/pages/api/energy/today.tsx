// src/pages/api/energy/today.tsx
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint is no longer used. Keep it so old links don't crash.
  res.status(410).json({
    error: "This endpoint is deprecated. Please use the main /today page in the app.",
  });
}
