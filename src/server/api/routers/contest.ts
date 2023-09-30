import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const contestRouter = createTRPCRouter({
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
      return ctx.prisma.contest.findMany({
        where: {
          archived: false,
          name: { contains: searchString },
          ownerId: { equals: ownerId },
          budget: { gte: minBudget, lte: maxBudget },
          category: {
            id: { equals: categoryId },
          },
        },
        include: {
          owner: true,
          category: true,
          products: {
            include: { freelancer: true },
          },
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
        dueDate: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.contest.create({
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
        dueDate: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.contest.update({
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
      return ctx.prisma.contest.update({
        where: { id },
        data: { archived: true },
      });
    }),
});
