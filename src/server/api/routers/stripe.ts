import { z } from "zod";

import { keys } from "../../../constants";
import { createTRPCRouter, protectedProcedure } from "../../../server/api/trpc";

export const stripeRouter = createTRPCRouter({
  checkoutSession: protectedProcedure
    .input(
      z.object({
        productName: z.string(),
        amount: z.number(),
        transactionId: z.string(),
      }),
    )
    .mutation(async ({ input: { amount, productName, transactionId }, ctx: { req, stripe } }) => {
      return await stripe.checkout.sessions.create({
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            quantity: 1,
            price_data: {
              product_data: {
                name: productName,
              },
              unit_amount: amount,
              currency: "VND",
            },
          },
        ],
        success_url: `${req.headers.origin || ""}/checkout?${keys.STRIPE_PARAM_ID}=${transactionId}`,
        cancel_url: `${req.headers.origin || ""}/`,
      });
    }),
});
