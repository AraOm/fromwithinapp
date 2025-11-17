// src/lib/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment");
}

// Use the default API version for this Stripe SDK.
// We don't need to hard-code apiVersion here.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});
