import { isGameOn } from '@/lib/utilsSurvivor';
import { throwTRPCError } from '@/lib/utilsTRPC';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const mapRouter = createTRPCRouter({
  getLocationsByScan: publicProcedure
    .input(z.object({ lat: z.number(), long: z.number() }))
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
        include: { messages: true },
      });

      // Filtro circular real (~100 m)
      const R = 6371e3; // raio da Terra em metros
      const toRad = (v: number) => (v * Math.PI) / 180;

      const result = points.filter((p) => {
        const dLat = toRad(p.latitude - input.lat);
        const dLon = toRad(p.longitude - input.long);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(input.lat)) * Math.cos(toRad(p.latitude)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= 100; // 🔥 apenas pontos até 100m
      });

      return result;
    }),

  getLocation: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.map.findUnique({
      where: { id: input.id },
      include: {
        itens: {
          where: {
            quantity: { gt: 0 }, // apenas armas com quantidade > 0
          },
        },
        messages: true,
      },
    });
  }),

  getAllByUser: publicProcedure.query(async ({ ctx, input }) => {
    // 1️⃣ Busca o player atual
    const player = await ctx.prisma.player.findUnique({
      where: { userId: ctx.session?.user.id },
      select: { id: true },
    });

    if (!player) throw throwTRPCError('Jogador não encontrado.');

    const pontos = await ctx.prisma.map.findMany({
      where: {
        OR: [
          { status: 0 }, // pontos públicos
          { path: { some: {} } }, // pontos que têm pelo menos 1 path
          {
            // pontos do player atual com status 1
            AND: [{ playerId: player.id }, { status: 1 }],
          },
        ],
      },
      include: {
        path: true, // trazer os paths relacionados
      },
    });

    return pontos;
  }),

  getAllUsersByLocation: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) return 0;
      return await ctx.prisma.player.count({
        where: {
          // cada jogador deve ter pelo menos um path cujo timestamp
          // é o mais recente E o mapId seja igual ao informado
          lastPath: {
            mapId: input.id,
          },
        },
      });
    }),

  itemEat: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.mapItens.findUnique({ where: { id: input.id } });
      if (!item) throw throwTRPCError('Item não encontrado');
      if (item.quantity <= 0) throw throwTRPCError('Item sem quantidade disponível');

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
      if (!player) throw throwTRPCError('PLayer not found');

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

  itemGet: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    if (!input.id) return 0;
    return await ctx.prisma.player.count({
      where: {
        // cada jogador deve ter pelo menos um path cujo timestamp
        // é o mais recente E o mapId seja igual ao informado
        lastPath: {
          mapId: input.id,
        },
      },
    });
  }),
  createBunker: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1️⃣ Busca o player atual
      const player = await ctx.prisma.player.findUnique({
        where: { userId: ctx.session?.user.id },
        select: { id: true },
      });

      if (!player) throw throwTRPCError('Jogador não encontrado.');

      // 2️⃣ Define margem aproximada (300 m ≈ 0.0027°)
      const margin = 0.0027;

      // 3️⃣ Busca locais próximos dentro da caixa (margem)
      const nearby = await ctx.prisma.map.findMany({
        where: {
          latitude: {
            gte: input.latitude - margin,
            lte: input.latitude + margin,
          },
          longitude: {
            gte: input.longitude - margin,
            lte: input.longitude + margin,
          },
        },
        select: {
          id: true,
          latitude: true,
          longitude: true,
        },
      });

      // 4️⃣ Calcula distância real (Haversine)
      const R = 6371e3; // raio da Terra (m)
      const toRad = (v: number) => (v * Math.PI) / 180;

      const tooClose = nearby.some((p) => {
        const dLat = toRad(p.latitude - input.latitude);
        const dLon = toRad(p.longitude - input.longitude);
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(input.latitude)) * Math.cos(toRad(p.latitude)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= 300; // 🚫 dentro do raio de 300 m
      });

      if (tooClose) {
        return null; // ❌ bunker muito próximo
      }

      // 5️⃣ Cria o bunker
      const bunker = await ctx.prisma.map.create({
        data: {
          name: input.name,
          description: input.description,
          accuracy: 50,
          latitude: input.latitude,
          longitude: input.longitude,
          status: 1,
          playerId: player.id,
        },
      });

      if (isGameOn())
        // 6️⃣ Faz o check-in automático
        await ctx.prisma.path.create({
          data: {
            latitude: input.latitude,
            longitude: input.longitude,
            accuracy: 50,
            timestamp: new Date(),
            playerId: player.id,
            mapId: bunker.id,
            lastPathOf: {
              connect: { id: player.id },
            },
          },
        });

      return bunker;
    }),
});
