import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const educationRouter = createTRPCRouter({
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
      return ctx.prisma.education.findMany({
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
        school: z.string(),
        from: z.string().optional(),
        to: z.string().optional(),
        area: z.string().optional(),
        description: z.string().optional(),
        degreeId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.education.create({
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
        school: z.string(),
        from: z.string().optional(),
        to: z.string().optional(),
        area: z.string().optional(),
        description: z.string().optional(),
        degreeId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.education.update({
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
      return ctx.prisma.education.delete({
        where: { id },
      });
    }),
});
