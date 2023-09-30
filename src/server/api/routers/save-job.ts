import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const saveJobRouter = createTRPCRouter({
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
      return ctx.prisma.savedJob.findMany({
        where: {
          freelancerId: userId,
          job: {
            archived: false,
          },
        },
        include: {
          job: {
            include: {
              owner: true,
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        jobId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.savedJob.findUnique({
        where: {
          freelancerId_jobId: input,
        },
      });
    }),

  /**
   *
   */
  save: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        jobId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.savedJob.create({
        data: input,
      });
    }),

  /**
   *
   */
  unsave: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        jobId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.savedJob.delete({
        where: {
          freelancerId_jobId: input,
        },
      });
    }),
});
