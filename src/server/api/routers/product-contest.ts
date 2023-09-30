import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productContestRouter = createTRPCRouter({
  /**
   *
   */
  getProductListByContest: protectedProcedure
    .input(
      z.object({
        contestId: z.string(),
        freelancerId: z.string().optional(),
      }),
    )
    .query(({ ctx, input: { contestId, freelancerId } }) => {
      return ctx.prisma.productContest.findMany({
        where: { contestId, freelancerId },
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
        freelancerId: z.string(),
        contestId: z.string(),
        url: z.string().url().optional(),
        gallery: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.productContest.create({
        data: input,
      });
    }),

  /**
   *
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.productContest.delete({
        where: { id },
      });
    }),
});
