import { TransactionOrderType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
  /**
   *
   */
  createReviewService: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        rating: z.number(),
        reviewerId: z.string(),
        serviceId: z.string(),
        orderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.orderId) {
        await ctx.prisma.orderService.update({
          where: {
            id: input.orderId,
          },
          data: {
            reviewServiceDone: true,
          },
        });
      }

      delete input.orderId;

      return ctx.prisma.reviewService.create({
        data: input,
      });
    }),

  /**
   *
   */
  createReviewFreelancer: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        rating: z.number(),
        userIdDoReview: z.string(),
        userIdBeReviewed: z.string(),
        orderId: z.string().optional(),
        type: z.enum([TransactionOrderType.CONTEST, TransactionOrderType.JOB, TransactionOrderType.SERVICE]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.orderId && input.type) {
        switch (input.type) {
          case TransactionOrderType.SERVICE:
            await ctx.prisma.orderService.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewFreelancerDone: true,
              },
            });
            break;

          case TransactionOrderType.JOB:
            await ctx.prisma.orderJob.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewFreelancerDone: true,
              },
            });
            break;

          case TransactionOrderType.CONTEST:
            await ctx.prisma.orderContest.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewFreelancerDone: true,
              },
            });
            break;

          default:
            break;
        }
      }

      delete input.orderId;
      delete input.type;

      return ctx.prisma.reviewUser.create({
        data: input,
      });
    }),

  /**
   *
   */
  createReviewClient: protectedProcedure
    .input(
      z.object({
        comment: z.string(),
        rating: z.number(),
        userIdDoReview: z.string(),
        userIdBeReviewed: z.string(),
        orderId: z.string().optional(),
        type: z.enum([TransactionOrderType.CONTEST, TransactionOrderType.JOB, TransactionOrderType.SERVICE]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.orderId && input.type) {
        switch (input.type) {
          case TransactionOrderType.SERVICE:
            await ctx.prisma.orderService.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewClientDone: true,
              },
            });
            break;

          case TransactionOrderType.JOB:
            await ctx.prisma.orderJob.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewClientDone: true,
              },
            });
            break;

          case TransactionOrderType.CONTEST:
            await ctx.prisma.orderContest.update({
              where: {
                id: input.orderId,
              },
              data: {
                reviewClientDone: true,
              },
            });
            break;

          default:
            break;
        }
      }

      delete input.orderId;
      delete input.type;

      return ctx.prisma.reviewUser.create({
        data: input,
      });
    }),
});
