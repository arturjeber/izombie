import { TRPCError } from '@trpc/server';

export function throwTRPCError(message: string) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message
  });
}

