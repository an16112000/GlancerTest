import { createTRPCRouter, publicProcedure } from "../trpc";

export const degreeRouter = createTRPCRouter({
  /**
   *
   */
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.degree.findMany();
  }),
});
