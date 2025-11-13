import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  if (!priceId) return res.status(500).json({ error: "Missing STRIPE_PRICE_ID_MONTHLY" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 7 },
      success_url: `${baseUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/onboarding`,
    });

    // (Optional) set a dev cookie "logged in" so middleware treats the user as authed
    res.setHeader("Set-Cookie", [
      `gw_logged_in=1; Path=/; HttpOnly; SameSite=Lax`,
      `gw_sub_status=trialing; Path=/; HttpOnly; SameSite=Lax`,
    ]);

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Stripe checkout creation failed" });
  }
}
