import { PrismaClient } from "@prisma/client";

var prismaClient: PrismaClient;

/**
 * @author JustBrandonLim
 *x`
 * @returns {PrismaClient} The Prisma Client
 */
export function GetPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }

  return prismaClient;
}
