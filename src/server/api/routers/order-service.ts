import { OrderStatus, Role, TransactionOrderType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderServiceRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { userId } }) => {
      return await ctx.prisma.orderService.findMany({
        where: {
          OR: [
            {
              clientId: userId,
            },
            {
              service: {
                ownerId: userId,
              },
            },
          ],
        },
        include: {
          service: {
            include: { owner: true },
          },
          client: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  check: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        serviceId: z.string(),
      }),
    )
    .mutation(({ input: { clientId, serviceId }, ctx }) => {
      return ctx.prisma.orderService.findFirst({
        where: {
          clientId,
          serviceId,
          status: OrderStatus.PENDING,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        serviceId: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.orderService.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        status: z
          .enum([
            OrderStatus.APPROVED,
            OrderStatus.CANCELED,
            OrderStatus.COMPLETED,
            OrderStatus.DOING,
            OrderStatus.PENDING,
            OrderStatus.REJECTED,
          ])
          .optional(),
        freelancerDone: z.boolean().optional(),
        canceler: z.enum([Role.CLIENT, Role.FREELANCER]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = input.id;

      const current = await ctx.prisma.orderService.findUnique({
        where: { id },
      });

      if (current?.status === OrderStatus.COMPLETED) return;

      delete input.id;

      const orderResult = await ctx.prisma.orderService.update({
        where: { id },
        data: input,
      });

      if (input.status !== OrderStatus.COMPLETED) return orderResult;

      const orderInfo = await ctx.prisma.orderService.findUnique({
        where: { id },
        include: {
          service: true,
        },
      });

      return await ctx.prisma.transaction.create({
        data: {
          amount: orderInfo?.service.price || 0,
          orderId: id || "",
          receiverId: orderInfo?.service.ownerId || "",
          senderId: orderInfo?.clientId || "",
          type: TransactionOrderType.SERVICE,
        },
      });
    }),
});
