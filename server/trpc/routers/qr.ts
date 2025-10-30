import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const qrRouter = createTRPCRouter({
  qrAdd: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        long: z.number(),
        info: z.string(),
        accu: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('QR ADD', ctx.session?.user);
      const y = await ctx.prisma.qrRead.create({
        data: {
          latitude: input.lat,
          longitude: input.long,
          info: input.info,
          playerId: ctx.session?.user.playerId,
          accuracy: input.accu ?? 0,
          timestamp: Date.now(),
        },
      });
      console.log('QR ADD result', y);

      return { result: 'ok' };
    }),
});
