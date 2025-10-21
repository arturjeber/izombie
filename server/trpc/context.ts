import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const createContext = async () => {
  const session = await auth();
  return { prisma, session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
