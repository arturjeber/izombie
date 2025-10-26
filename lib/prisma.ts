import { PrismaClient } from '@prisma/client';
import { throwTRPCError } from './utilsTRPC';

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw throwTRPCError('DATABASE_URL não definida. Verifique o .env ou as variáveis no Azure.');
  }

  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  return prisma;
}
