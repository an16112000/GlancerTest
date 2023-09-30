import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const serviceRouter = createTRPCRouter({
  /**
   *
   */
  getAll: publicProcedure
    .input(
      z.object({
        ownerId: z.string().optional(),
        searchString: z.string().optional(),
        categoryId: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      }),
    )
    .query(({ ctx, input: { ownerId, searchString = "", categoryId, minPrice, maxPrice } }) => {
      return ctx.prisma.service.findMany({
        where: {
          archived: false,
          name: { contains: searchString },
          ownerId: { equals: ownerId },
          price: { gte: minPrice, lte: maxPrice },
          category: {
            id: { equals: categoryId },
          },
        },
        include: {
          owner: true,
          category: true,
          favorites: true,
          reviews: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  /**
   *
   */
  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input: { id } }) => {
    return ctx.prisma.service.findUnique({
      where: { id },
      include: {
        owner: {
          include: { listBeReviewed: true },
        },
        category: true,
        favorites: true,
        reviews: {
          include: { reviewer: true },
        },
        orders: true,
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
        price: z.number(),
        categoryId: z.string(),
        banner: z.string(),
        gallery: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.service.create({
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
        price: z.number(),
        categoryId: z.string(),
        banner: z.string(),
        gallery: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.service.update({
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
      return ctx.prisma.service.update({
        where: { id },
        data: { archived: true },
      });
    }),
});
