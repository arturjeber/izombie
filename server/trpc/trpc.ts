import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throwTRPCError('Usuário não autenticado');
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});
