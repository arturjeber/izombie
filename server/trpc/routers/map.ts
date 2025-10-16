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
				include: {messages: true,},
			 });
			return points;
		}),
	
	getLocation: publicProcedure
		.input(z.object({ id: z.number()}))
		.query(async ({ ctx, input }) => {
			return await ctx.prisma.map.findUnique({ 
				where: { id: input.id },
				include: {
					weapons: {
						where: {
							quantity: { gt: 0 }, // apenas armas com quantidade > 0
						},
					},
					itens: {
						where: {
							quantity: { gt: 0 }, // apenas armas com quantidade > 0
						},
					},
					messages: true,
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
			if(!input.id) return 0;
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

	itemEat: publicProcedure
		.input(z.object({ 
			id: z.number(),
		}))
		.mutation(async ({ ctx, input }) => {
			const item = await ctx.prisma.mapItens.findUnique({ where: { id: input.id } });
			if (!item) throw new Error("Item não encontrado");
			if (item.quantity <= 0) throw new Error("Item sem quantidade disponível");
			
			const itemAtualizado = await ctx.prisma.mapItens.update({
				where: { id: input.id },
				data: {
					quantity : {
						decrement: 1, // diminui em 1 unidade
					},
				},
			});

			let energyValue = 0;
			try {
				const efeitoData = JSON.parse(item.effect);
				
				if (efeitoData.energy) energyValue = Number(efeitoData.energy);
			} catch (err) {
				console.error("Erro ao ler efeito:", err);
			}

			const player = await ctx.prisma.player.findUnique({
				where: { userId: ctx.session?.user.id },
				select: { energy: true },
			});
			if (!player) throw new Error("PLayer not found");

			const novaEnergia = Math.min(100, player.energy + energyValue);

			await ctx.prisma.player.update({
				where: { userId: ctx.session?.user.id },
				data: { energy: novaEnergia },
			});

			return {
				item: itemAtualizado,
				energiaGanha: energyValue,
				energiaFinal: novaEnergia,
			};
		}),
	
	itemGet: publicProcedure
		.input(z.object({ id: z.number()}))
		.query(async ({ ctx, input }) => {
			if(!input.id) return 0;
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
