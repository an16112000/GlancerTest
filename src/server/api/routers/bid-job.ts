import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bidJobRouter = createTRPCRouter({
  /**
   *
   */
  getBidListByJob: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
      }),
    )
    .query(({ ctx, input: { jobId } }) => {
      return ctx.prisma.bidJob.findMany({
        where: { jobId },
        include: {
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
  create: protectedProcedure
    .input(
      z.object({
        price: z.number(),
        freelancerId: z.string(),
        jobId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bidJob.create({
        data: input,
      });
    }),

  /**
   *
   */
  delete: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        jobId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bidJob.delete({
        where: {
          freelancerId_jobId: input,
        },
      });
    }),
});
