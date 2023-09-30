import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const saveContestRouter = createTRPCRouter({
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
      return ctx.prisma.savedContest.findMany({
        where: {
          freelancerId: userId,
          contest: {
            archived: false,
          },
        },
        include: {
          contest: {
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

  /**
   *
   */
  getById: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        contestId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.savedContest.findUnique({
        where: {
          freelancerId_contestId: input,
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
        contestId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.savedContest.create({
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
        contestId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.savedContest.delete({
        where: {
          freelancerId_contestId: input,
        },
      });
    }),
});
