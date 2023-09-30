import { TransactionOrderType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const transactionRouter = createTRPCRouter({
  /**
   *
   */
  getAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input: { userId } }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              receiverId: userId,
            },
          ],
          done: true,
        },
        include: {
          receiver: true,
          sender: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  /**
   *
   */
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        amount: z.number(),
        orderId: z.string(),
        receiverId: z.string(),
        senderId: z.string(),
        type: z.enum([TransactionOrderType.CONTEST, TransactionOrderType.JOB, TransactionOrderType.SERVICE]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.transaction.create({
        data: input,
      });
    }),

  /**
   *
   */
  getTotalReceived: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input: { userId } }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          receiverId: userId,
          done: true,
        },
      });
    }),
});
