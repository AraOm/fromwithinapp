// src/pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

type Data = { url: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan } = req.body || {};

  // Decide which Stripe price + mode to use
  let priceId: string | undefined;
  let mode: "subscription" | "payment" = "subscription";

  if (plan === "golden") {
    priceId = process.env.NEXT_PUBLIC_PRICE_GOLDEN;
    mode = "subscription";
  } else if (plan === "infinity") {
    priceId = process.env.NEXT_PUBLIC_PRICE_INFINITY;
    mode = "payment";
  }

  if (!priceId) {
    console.error("Missing or invalid plan/priceId", { plan, priceId });
    return res.status(400).json({ error: "Invalid plan or missing price id" });
  }

  const successUrl =
    process.env.NEXT_PUBLIC_SUCCESS_URL ||
    "http://localhost:3000/checkout/success";
  const cancelUrl =
    process.env.NEXT_PUBLIC_CANCEL_URL ||
    "http://localhost:3000/checkout/cancel";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ url: session.url ?? "" });
  } catch (err: any) {
    console.error("Stripe checkout error:", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
    });
    return res
      .status(500)
      .json({ error: err?.message || "Stripe checkout error" });
  }
}
