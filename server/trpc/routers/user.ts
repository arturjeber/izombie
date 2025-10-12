import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.user.findUnique({ where: { id: input.id } })),

  createPlayer: publicProcedure
    .input(z.object({ userId: z.string()}))
    .mutation(({ ctx, input }) => ctx.prisma.player.create({ data: input })),

  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().optional(), password: z.string().optional() }))
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

	loaduser: publicProcedure
    .mutation(async ({ ctx, input }) => {
			const userId = ctx.session?.user.id;
      const player = await ctx.prisma.player.findUnique({
				where: { userId },
				include: {
					paths: {
						orderBy: { timestamp: "desc" },
						take: 1,
					},
					_count: {
						select: { mortes: true },
					},
				},
			});
			return player
    }),
});
