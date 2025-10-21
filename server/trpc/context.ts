import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export const createContext = async () => {
  const session = await auth();
  return { prisma: getPrisma(), session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
