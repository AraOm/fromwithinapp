// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

type Data = { url: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan } = req.body || {};

  let priceId: string | undefined;
  let mode: "subscription" | "payment" = "subscription";

  if (plan === "golden") {
    // Monthly Golden Lion
    priceId = process.env.NEXT_PUBLIC_PRICE_GOLDEN;
    mode = "subscription";
  } else if (plan === "infinity") {
    // Lifetime Infinity Path
    priceId = process.env.NEXT_PUBLIC_PRICE_INFINITY;
    mode = "payment";
  }

  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/welcome?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/welcome?canceled=1`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return res.status(500).json({ error: "No checkout URL returned" });
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return res.status(500).json({
      error: err?.message || "Failed to create checkout session",
    });
  }
}
