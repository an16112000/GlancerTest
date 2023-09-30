import { OrderStatus, Role, TransactionOrderType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderContestRouter = createTRPCRouter({
  /**
   *
   */
  getAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { userId } }) => {
      return await ctx.prisma.orderContest.findMany({
        where: {
          OR: [
            {
              freelancerId: userId,
            },
            {
              contest: { ownerId: userId },
            },
          ],
        },
        include: {
          freelancer: true,
          contest: {
            include: { owner: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  /**
   *
   */
  check: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        contestId: z.string(),
      }),
    )
    .mutation(({ input: { freelancerId, contestId }, ctx }) => {
      return ctx.prisma.orderContest.findFirst({
        where: {
          freelancerId,
          contestId,
        },
      });
    }),

  /**
   *
   */
  create: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        contestId: z.string(),
        gallery: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.contest.update({
        where: {
          id: input.contestId,
        },
        data: {
          archived: true,
        },
      });

      return ctx.prisma.orderContest.create({
        data: input,
      });
    }),

  /**
   *
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        status: z
          .enum([
            OrderStatus.APPROVED,
            OrderStatus.CANCELED,
            OrderStatus.COMPLETED,
            OrderStatus.DOING,
            OrderStatus.PENDING,
            OrderStatus.REJECTED,
          ])
          .optional(),
        freelancerDone: z.boolean().optional(),
        canceler: z.enum([Role.CLIENT, Role.FREELANCER]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = input.id;

      const current = await ctx.prisma.orderContest.findUnique({
        where: { id },
      });

      if (current?.status === OrderStatus.COMPLETED) return;

      const orderResult = await ctx.prisma.orderContest.update({
        where: { id },
        data: input,
      });

      if (input.status !== OrderStatus.COMPLETED) return orderResult;

      const orderInfo = await ctx.prisma.orderContest.findUnique({
        where: { id },
        include: {
          contest: true,
        },
      });

      return await ctx.prisma.transaction.create({
        data: {
          amount: orderInfo?.contest.budget || 0,
          orderId: id || "",
          receiverId: orderInfo?.freelancerId || "",
          senderId: orderInfo?.contest.ownerId || "",
          type: TransactionOrderType.CONTEST,
        },
      });
    }),
});
