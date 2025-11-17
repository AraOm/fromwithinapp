// src/pages/api/stripe-webhook.ts
// Temporary stub for Stripe webhooks during beta.
// This prevents build errors while we focus on the main app flow.

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // keep raw body behavior in case we re-enable real webhooks later
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.warn("[Stripe Webhook] Stub endpoint hit. No processing is performed.");

  // For now, just acknowledge so Stripe doesn't treat it as a failure.
  if (req.method === "POST") {
    return res.status(200).json({ received: true, stub: true });
  }

  res.setHeader("Allow", "POST");
  return res.status(405).json({ error: "Method not allowed" });
}
