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
    .input(z.object({ 
			name: z.string().optional(), 
			password: z.string().optional(), 
			energy: z.number().optional() 
		}))
    .mutation(({ ctx, input }) => {
			const userId = ctx.session?.user.id;
    if (!userId) throw new Error("Usuário não autenticado");

    // Remover campos undefined para evitar erro no Prisma
    const data: any = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.password !== undefined) data.password = input.password;
    if (input.energy !== undefined) data.energy = input.energy;

    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum dado para atualizar");
    }

      return ctx.prisma.player.update({ where: { userId }, data });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.id } });
      return { success: true };
    }),

		loaduser: publicProcedure
    .query(async ({ ctx }) => {
			const userId = ctx.session?.user.id;
      const player = await ctx.prisma.player.findUnique({
				where: { userId },
				include: {
					paths: {
						orderBy: { timestamp: "desc" },
						take: 1,
						include: {
							map: {
								include: {
									armas: true,          // 🔫 inclui armas do mapa
									comunicados: true, // 📡 inclui comunicações
									comidas: true,         // 🍞 inclui comida
								}, // ← aqui traz o registro do mapa vinculado ao path
							},
						}
					},
					_count: {
						select: { mortes: true },
					},
				},
			});
			return player
    }),
		openDoor: publicProcedure
		.input(z.object({ 
			latitude: z.number(),
			longitude: z.number(),
			accuracy: z.number(),
			timestamp: z.number(),
			playerId: z.number(),
			mapId: z.number()
		}))
    .mutation(async ({ ctx, input }) => {
			// Criar path e atualizar lastPathId do player na mesma transação
    const result = await ctx.prisma.$transaction(async (prisma) => {
      // 1️⃣ Criar path
      const path = await prisma.path.create({
        data: {
          latitude: input.latitude,
          longitude: input.longitude,
          accuracy: input.accuracy,
          timestamp: new Date(input.timestamp),
          playerId: input.playerId,
          mapId: input.mapId,
        },
      });

      // 2️⃣ Atualizar lastPathId do player
      await prisma.player.update({
        where: { id: input.playerId },
        data: { lastPathId: path.id },
      });

      return path; // retorna o path criado
    });

    return result;
		}),
      
    
});
