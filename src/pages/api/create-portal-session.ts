// src/pages/api/create-portal-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

type Data = { url: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customerId } = req.body || {};

    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/welcome`,
    });

    if (!session.url) {
      return res.status(500).json({ error: "No portal URL returned" });
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe portal error", err);
    return res.status(500).json({
      error: err?.message || "Failed to create billing portal session",
    });
  }
}
