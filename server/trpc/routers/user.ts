import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.user.findUnique({ where: { id: input.id } })),

  create: publicProcedure
    .input(z.object({ name: z.string().optional(), email: z.string().email() }))
    .mutation(({ ctx, input }) => ctx.prisma.user.create({ data: input })),

  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().optional(), email: z.string().optional() }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.user.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
