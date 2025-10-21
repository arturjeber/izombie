import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
  }
  return prisma;
}
