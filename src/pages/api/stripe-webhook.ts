import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // session.subscription contains the subscription ID
        // session.customer_email or session.customer gives you the user
        const appUserId =
          (session.metadata?.appUserId as string) ||
          (session.subscription &&
            typeof session.subscription !== "string" &&
            session.subscription.metadata?.appUserId) ||
          "";

        const tier = (session.metadata?.tier as string) ?? "";

        // Mark user as active trial / active sub in Supabase
        // Example assumes a "profiles" table with subscription fields—adjust to your schema
        await supabase
          .from("profiles")
          .upsert({
            id: appUserId || undefined,
            email: session.customer_email ?? undefined,
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : session.customer?.id,
            stripe_subscription_id:
              typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            plan_tier: tier,
            subscription_status: "active", // will be "trialing" in Stripe; store your own state if you like
          }, { onConflict: "id" });

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const appUserId = sub.metadata?.appUserId ?? "";
        await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: sub.id,
            subscription_status: sub.status, // trialing, active, past_due, canceled, etc.
            plan_tier: sub.items.data[0]?.price?.nickname ?? null,
          })
          .eq("id", appUserId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const appUserId = sub.metadata?.appUserId ?? "";
        await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
          })
          .eq("id", appUserId);
        break;
      }

      default:
        // No-op for other events
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error", err);
    res.status(500).send("Webhook handler failed");
  }
}
