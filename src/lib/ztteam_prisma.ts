import { PrismaClient } from "../generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

/** Singleton Prisma Client cho PostgreSQL (Neon) */
const ztteam_globalForPrisma = globalThis as unknown as {
  ztteam_prisma: PrismaClient | undefined;
};

function ztteam_createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const ztteam_prisma =
  ztteam_globalForPrisma.ztteam_prisma ?? ztteam_createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  ztteam_globalForPrisma.ztteam_prisma = ztteam_prisma;
}
