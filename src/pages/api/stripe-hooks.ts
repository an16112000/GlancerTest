import { OrderStatus, TransactionOrderType } from "@prisma/client";
import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";

import { keys } from "../../constants";
import { stripe } from "../../libs/stripe-server";
import { prisma } from "../../server/db";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export const config = { api: { bodyParser: false } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const reqBuffer = await buffer(req);
    const signature = req.headers["stripe-signature"];
    const signingSecret = "whsec_FfaV8GBOFTzMLttC9faDTTXFaqf5xzv5";

    try {
      if (signature) {
        const event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);

        const data = JSON.parse(JSON.stringify(event.data.object)) as { success_url: string };
        const id = new URLSearchParams(new URL(data.success_url).search).get(keys.STRIPE_PARAM_ID);

        if (id) {
          const transaction = await prisma.transaction.findUnique({ where: { id } });

          if (!!transaction) {
            switch (transaction.type) {
              case TransactionOrderType.CONTEST:
                await prisma.orderContest.update({
                  where: { id: transaction.orderId },
                  data: { status: OrderStatus.COMPLETED },
                });
                break;

              case TransactionOrderType.JOB:
                await prisma.orderJob.update({
                  where: { id: transaction.orderId },
                  data: { status: OrderStatus.COMPLETED },
                });
                break;

              case TransactionOrderType.SERVICE:
                await prisma.orderService.update({
                  where: { id: transaction.orderId },
                  data: { status: OrderStatus.COMPLETED },
                });
                break;

              default:
                break;
            }

            return prisma.transaction.update({
              where: { id },
              data: {
                done: true,
              },
            });
          } else {
            throw "Transaction not found!";
          }
        } else {
          throw "Transaction id not found!";
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: `Webhook error` });
    }

    res.send({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export default cors(handler as any);
