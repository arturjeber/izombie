import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const mapRouter = createTRPCRouter({
	getLocationsByScan: publicProcedure
		.input(z.object({ lat: z.number(), long:z.number() }))
		.mutation(async ({ ctx, input }) => {
			const margin = 0.001; // ~100 metros
			const points = await ctx.prisma.map.findMany({ 
				where: {
					latitude: {
						gte: input.lat - margin,
						lte: input.lat + margin,
					},
					longitude: {
						gte: input.long - margin,
						lte: input.long + margin,
					},
				},
				include: {
					comunicados: true,
				},
			 });
			return points;
		}),
		getLocation: publicProcedure
		.input(z.object({ id: z.number()}))
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.map.findUnique({ 
				where: { id: input.id },
				include: {
					armas: true,
					comidas: true,
					comunicados: true,
				},
			 });
			
		}),


});
