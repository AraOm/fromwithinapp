import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { plan, userId, email } = req.body as {
      plan: "golden" | "infinity"; // "golden" = $11.11/mo, "infinity" = $333 one-time
      userId?: string;
      email?: string;
    };

    const successUrl = process.env.NEXT_PUBLIC_SUCCESS_URL as string;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL as string;

    if (plan === "golden") {
      const priceId = process.env.NEXT_PUBLIC_PRICE_GOLDEN;
      if (!priceId) return res.status(400).json({ error: "Missing subscription price id" });

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        billing_address_collection: "auto",
        allow_promotion_codes: true,
        customer_creation: "if_required",
        customer_email: email,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        line_items: [{ price: priceId, quantity: 1 }],
        // 7-day trial lives on the Price; we just tag metadata here
        subscription_data: {
          metadata: { appUserId: userId ?? "", plan: "golden" },
        },
        metadata: { appUserId: userId ?? "", plan: "golden" },
      });

      return res.status(200).json({ url: session.url });
    }

    if (plan === "infinity") {
      const priceId = process.env.NEXT_PUBLIC_PRICE_INFINITY;
      if (!priceId) return res.status(400).json({ error: "Missing lifetime price id" });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        billing_address_collection: "auto",
        allow_promotion_codes: true,
        customer_creation: "if_required",
        customer_email: email,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { appUserId: userId ?? "", plan: "infinity" },
      });

      return res.status(200).json({ url: session.url });
    }

    return res.status(400).json({ error: "Unknown plan" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
