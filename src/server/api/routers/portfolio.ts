import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const portfolioRouter = createTRPCRouter({
  /**
   *
   */
  getAllByProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .query(({ ctx, input: { profileId } }) => {
      return ctx.prisma.portfolio.findMany({
        where: { profileId },
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
        profileId: z.string(),
        title: z.string(),
        description: z.string(),
        gallery: z.string().optional(),
        videoUrl: z.string().optional(),
        skills: z.string().optional(),
        projectUrl: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.portfolio.create({
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
        profileId: z.string(),
        title: z.string(),
        description: z.string(),
        gallery: z.string().optional(),
        videoUrl: z.string().optional(),
        skills: z.string().optional(),
        projectUrl: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.portfolio.update({
        where: { id },
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
      return ctx.prisma.portfolio.delete({
        where: { id },
      });
    }),
});
