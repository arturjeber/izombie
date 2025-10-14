import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllByAltText } from "@testing-library/react";

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
	getAllByUser: publicProcedure
		.query(async ({ ctx, input }) => {
			const pontos = await ctx.prisma.map.findMany({
				where: {
					OR: [
						{ status: 0 }, // pontos públicos
						{ path: { some: {} } }, // pontos que têm pelo menos 1 path
					],
				},
				include: {
					path: true, // se quiser trazer os paths relacionados
				},
			});
	
			return pontos;
		}),
	getAllUsersByLocation: publicProcedure
		.input(z.object({ id: z.number()}))
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.player.count({
				where: {
					// cada jogador deve ter pelo menos um path cujo timestamp
					// é o mais recente E o mapId seja igual ao informado
					lastPath: {
						mapId: input.id
					}
				}
			});
	
		}),


});
