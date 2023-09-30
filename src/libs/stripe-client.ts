import { type Stripe, loadStripe } from "@stripe/stripe-js";

import { env } from "../env/client.mjs";

let stripe: Stripe | null;

export const getStripe = async () => {
  if (!stripe) {
    stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PK);
  }

  return stripe;
};
