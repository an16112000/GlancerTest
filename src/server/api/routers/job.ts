import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const jobRouter = createTRPCRouter({
  /**
   *
   */
  getAll: protectedProcedure
    .input(
      z.object({
        ownerId: z.string().optional(),
        searchString: z.string().optional(),
        categoryId: z.string().optional(),
        minBudget: z.number().optional(),
        maxBudget: z.number().optional(),
      }),
    )
    .query(({ ctx, input: { ownerId, searchString = "", categoryId, minBudget, maxBudget } }) => {
      return ctx.prisma.job.findMany({
        where: {
          name: { contains: searchString },
          ownerId: { equals: ownerId },
          archived: false,
          category: {
            id: { equals: categoryId },
          },
          budget: { gte: minBudget, lte: maxBudget },
        },
        include: {
          owner: true,
          category: true,
          bidList: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  /**
   *
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        ownerId: z.string(),
        info: z.string(),
        budget: z.number(),
        categoryId: z.string(),
        dayLength: z.number(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.job.create({
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
        name: z.string(),
        info: z.string(),
        budget: z.number(),
        categoryId: z.string(),
        dayLength: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.job.update({
        where: { id },
        data: input,
      });
    }),

  /**
   *
   */
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.job.update({
        where: { id },
        data: { archived: true },
      });
    }),
});
