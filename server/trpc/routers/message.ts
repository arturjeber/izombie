import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.email(),
        message: z.string(),
        origen: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.messages.create({ data: input });
        return result;
      } catch (err) {
        console.error('Erro ao criar mensagem:', err);
        throw err;
      }
    }),
});
