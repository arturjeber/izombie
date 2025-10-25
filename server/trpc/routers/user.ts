import { haversine } from '@/lib/utils';
import { throwTRPCError } from '@/lib/utilsTRPC';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';


export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.prisma.user.findUnique({ where: { id: input.id } })),

  createPlayer: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) => ctx.prisma.player.create({ data: input })),

  update: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        password: z.string().optional(),
        energy: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (!userId) throwTRPCError('Usuário não autenticado');

      // Remover campos undefined para evitar erro no Prisma
      const data: any = {};
      if (input.name !== undefined) data.name = input.name;
      if (input.password !== undefined) data.password = input.password;
      if (input.energy !== undefined) data.energy = input.energy;

      if (Object.keys(data).length === 0) {
       throwTRPCError('Nenhum dado para atualizar');
      }

      return ctx.prisma.player.update({ where: { userId }, data });
    }),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.delete({ where: { id: input.id } });
    return { success: true };
  }),

  loaduser: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    const player = await ctx.prisma.player.findUnique({
      where: { userId },
      include: {
        backpack: true,
        paths: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            map: {
              include: {
                itens: { where: { quantity: { gt: 0 } } },
                messages: true,
              },
            },
          },
        },
        _count: {
          select: { mortes: true },
        },
      },
    });
    return player;
  }),
  openDoor: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number(),
        timestamp: z.number(),
        playerId: z.number(),
        mapId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Criar path e atualizar lastPathId do player na mesma transação
      const result = await ctx.prisma.$transaction(async (prisma) => {

				// 1️⃣ Buscar último path do player
				const player = await prisma.player.findUnique({
					where: { id: input.playerId },
					include: { lastPath: true }, // supondo que tenha relação lastPath
				});
	
				if (!player) return throwTRPCError('Player not found');
	
				// 2️⃣ Validar se a posição mudou
				const lastPath = player.lastPath;
				// Verificar se a distância é menor ou igual a 100m usando a função haversine existente
				if (
					lastPath &&
					haversine(
						lastPath.latitude,
						lastPath.longitude,
						input.latitude,
						input.longitude
					) <= 100
				) {
					return throwTRPCError('Player is already at this location or too close.');
				}
				
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

  eat: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.mapItens.findUnique({ where: { id: input.id } });
      if (!item) return throwTRPCError('Item não encontrado');
      if (item.quantity <= 0) return throwTRPCError('Item sem quantidade disponível');

      const itemAtualizado = await ctx.prisma.mapItens.update({
        where: { id: input.id },
        data: {
          quantity: {
            decrement: 1, // diminui em 1 unidade
          },
        },
      });

      let energyValue = 0;
      try {
        const efeitoData = JSON.parse(item.effect);

        if (efeitoData.energy) energyValue = Number(efeitoData.energy);
      } catch (err) {
        console.error('Erro ao ler efeito:', err);
      }

      const player = await ctx.prisma.player.findUnique({
        where: { userId: ctx.session?.user.id },
        select: { energy: true },
      });
      if (!player) return throwTRPCError('PLayer not found');

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
  getItem: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const item = await ctx.prisma.mapItens.findUnique({ where: { id: input.id } });
    if (!item) return throwTRPCError('Item não encontrado');
    if (item.quantity <= 0) return throwTRPCError('Item sem quantidade disponível');

    // 3️⃣ Busca o player
    const player = await ctx.prisma.player.findUnique({
      where: { userId: ctx.session?.user.id },
      select: { id: true, limitItens: true },
    });
    if (!player) return throwTRPCError('Player não encontrado');

    // 3️⃣ Calcula o espaço já ocupado na backpack
    const inventario = await ctx.prisma.itens.findMany({
      where: { playerId: player.id },
      select: { size: true, quantity: true },
    });

    const espacoOcupado = inventario.reduce((acc, i) => acc + i.size * i.quantity, 0);

    const espacoDisponivel = player.limitItens - espacoOcupado;

    if (espacoDisponivel < item.size) {
     throwTRPCError('Espaço insuficiente na mochila');
    }

    const itemAtualizado = await ctx.prisma.mapItens.update({
      where: { id: input.id },
      data: {
        quantity: {
          decrement: 1, // diminui em 1 unidade
        },
      },
    });

    // 4️⃣ Verifica se o item já existe no inventário
    const itemInventario = await ctx.prisma.itens.findFirst({
      where: {
        playerId: player.id,
        name: item.name,
      },
    });

    if (itemInventario) {
      // 5️⃣ Incrementa a quantidade se já existir
      await ctx.prisma.itens.update({
        where: { id: itemInventario.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      // 6️⃣ Cria novo item se não existir
      await ctx.prisma.itens.create({
        data: {
          playerId: player.id,
          name: item.name,
          size: item.size,
          kind: item.kind,
          effect: item.effect, // opcional
          quantity: 1,
        },
      });
    }

    // 7️⃣ Retorna resultado
    return {
      mensagem: `Item ${item.name} adicionado ao inventário`,
      itemMapa: itemAtualizado,
    };
  }),
  dropItem: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    // 1️⃣ Busca o player
    const player = await ctx.prisma.player.findUnique({
      where: { userId: ctx.session?.user.id },
      select: { id: true },
    });
    if (!player) return throwTRPCError('Player não encontrado');

    // 2️⃣ Busca o item no inventário do player
    const itemInventario = await ctx.prisma.itens.findFirst({
      where: {
        playerId: player.id,
        id: input.id,
      },
    });
    if (!itemInventario) return throwTRPCError('Item não encontrado no inventário');
    if (itemInventario.quantity <= 0) return throwTRPCError('Item sem quantidade disponível');

    // 3️⃣ Diminui 1 unidade do item no inventário do player
    const itemAtualizadoInventario = await ctx.prisma.itens.update({
      where: { id: itemInventario.id },
      data: { quantity: { decrement: 1 } },
    });

    // 4️⃣ Busca a última localização do player (mapa)
    const ultimaLocalizacao = await ctx.prisma.path.findFirst({
      where: { playerId: player.id },
      orderBy: { timestamp: 'desc' },
      select: { mapId: true },
    });
    if (!ultimaLocalizacao) return throwTRPCError('Última localização não encontrada');

    // 5️⃣ Adiciona o item na localização correspondente do mapa
    const itemMapa = await ctx.prisma.mapItens.findFirst({
      where: {
        mapId: ultimaLocalizacao.mapId,
        name: itemInventario.name,
      },
    });

    if (itemMapa) {
      // Incrementa quantidade se já existir
      await ctx.prisma.mapItens.update({
        where: { id: itemMapa.id },
        data: { quantity: { increment: 1 } },
      });
    } else {
      // Cria novo item no mapa
      await ctx.prisma.mapItens.create({
        data: {
          mapId: ultimaLocalizacao.mapId,
          name: itemInventario.name,
          size: itemInventario.size,
          effect: itemInventario.effect,
          quantity: 1,
        },
      });
    }

    return {
      mensagem: `Item ${itemInventario.name} dropado na última localização`,
      itemInventario: itemAtualizadoInventario,
    };
  }),
});
