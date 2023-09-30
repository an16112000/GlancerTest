import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  /**
   *
   */
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
});
