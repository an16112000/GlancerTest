import { OrderStatus, Role, TransactionOrderType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderJobRouter = createTRPCRouter({
  /**
   *
   */
  getAll: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input: { userId } }) => {
    return await ctx.prisma.orderJob.findMany({
      where: {
        OR: [
          {
            freelancerId: userId,
          },
          {
            job: {
              ownerId: userId,
            },
          },
        ],
      },
      include: {
        job: {
          include: { owner: true },
        },
        freelancer: true,
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
        jobId: z.string(),
      }),
    )
    .mutation(({ input: { freelancerId, jobId }, ctx }) => {
      return ctx.prisma.orderJob.findFirst({
        where: {
          freelancerId,
          jobId,
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
        jobId: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.orderJob.create({
        data: input,
      });

      return ctx.prisma.job.update({
        where: { id: input.jobId },
        data: { archived: true },
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

      const current = await ctx.prisma.orderJob.findUnique({
        where: { id },
      });

      if (current?.status === OrderStatus.COMPLETED) return;

      delete input.id;

      const orderResult = await ctx.prisma.orderJob.update({
        where: { id },
        data: input,
      });

      if (input.status !== OrderStatus.COMPLETED) return orderResult;

      const orderInfo = await ctx.prisma.orderJob.findUnique({
        where: { id },
        include: {
          job: true,
        },
      });

      return await ctx.prisma.transaction.create({
        data: {
          amount: orderInfo?.price || 0,
          orderId: id || "",
          receiverId: orderInfo?.freelancerId || "",
          senderId: orderInfo?.job.ownerId || "",
          type: TransactionOrderType.JOB,
        },
      });
    }),
});
