import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const freelancerProfileRouter = createTRPCRouter({
  /**
   * Lấy toàn bộ profile của freelaner (hiển thị ở giao diện Preview)
   */
  getAllByFreelancer: publicProcedure
    .input(
      z.object({
        freelancerId: z.string(),
      }),
    )
    .query(({ ctx, input: { freelancerId } }) => {
      return ctx.prisma.freelancerProfile.findMany({
        where: {
          freelancerId,
          active: true,
        },
        include: {
          category: true,
          employments: true,
          portfolios: true,
          educations: {
            include: { degree: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  /**
   * Lấy thông tin các profile của freelancer (sử dụng ở giao diện edit)
   */
  getListInfoByFreelancer: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
      }),
    )
    .query(({ ctx, input: { freelancerId } }) => {
      return ctx.prisma.freelancerProfile.findMany({
        where: { freelancerId },
      });
    }),

  /**
   *
   */
  create: protectedProcedure
    .input(
      z.object({
        freelancerId: z.string(),
        categoryId: z.string(),
        title: z.string(),
        description: z.string(),
        skills: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.freelancerProfile.create({
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
        freelancerId: z.string(),
        categoryId: z.string(),
        title: z.string(),
        description: z.string(),
        skills: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = input.id;

      delete input.id;

      return ctx.prisma.freelancerProfile.update({
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
      return ctx.prisma.freelancerProfile.delete({
        where: { id },
      });
    }),
});
