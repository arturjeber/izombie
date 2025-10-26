// src/server/trpc/router/auth.ts
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.email() }))
    .mutation(async ({ ctx, input }) => {
      // checar se o usuário já existe
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser)throw throwTRPCError('Usuário já existe');

      const pass = Math.random().toString(36);

      // criar usuário com senha criptografada
      const hashedPassword = await bcrypt.hash(pass, 12);
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });

      // retorna dados do usuário e senha temporária
      return { id: user.id, email: user.email, password: pass };
    }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session)throw throwTRPCError('Session não encontrada');

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user)throw throwTRPCError('Usuário não encontrado');

      // Verifica senha atual
      const isValid = await bcrypt.compare(input.currentPassword, user.password as string);
      if (!isValid)throw throwTRPCError('Senha atual incorreta');

      // Criptografa nova senha
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      // Atualiza no banco
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedPassword },
      });

      return { message: 'Senha atualizada com sucesso' };
    }),
});
