import { z } from "zod";

import { keys } from "../../../constants";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  /**
   *
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input: { id } }) => {
      return ctx.prisma.user.findUnique({
        where: { id },
        include: {
          listBeReviewed: {
            include: { userDoReview: true },
          },
        },
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
        email: z.string().email(),
        phone: z.string().regex(keys.PHONE_REGEX),
        address: z.string(),
        image: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.user.update({
        where: { id },
        data: input,
      });
    }),
});
