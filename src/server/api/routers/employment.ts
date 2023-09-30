import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const employmentRouter = createTRPCRouter({
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
      return ctx.prisma.employment.findMany({
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
        company: z.string(),
        address: z.string(),
        title: z.string(),
        from: z.string(),
        to: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.employment.create({
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
        company: z.string(),
        address: z.string(),
        title: z.string(),
        from: z.string(),
        to: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.employment.update({
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
      return ctx.prisma.employment.delete({
        where: { id },
      });
    }),
});
