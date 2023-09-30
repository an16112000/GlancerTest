import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const favoriteSeriveRouter = createTRPCRouter({
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
      return ctx.prisma.favoriteService.findMany({
        where: {
          clientId: userId,
          service: {
            archived: false,
          },
        },
        include: {
          service: {
            include: {
              owner: true,
              category: true,
              reviews: true,
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
  save: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        serviceId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.favoriteService.create({
        data: input,
      });
    }),

  /**
   *
   */
  unsave: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        serviceId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.favoriteService.delete({
        where: {
          clientId_serviceId: input,
        },
      });
    }),
});
