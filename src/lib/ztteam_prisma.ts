import { PrismaClient } from "../generated/prisma/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/** Singleton Prisma Client để tránh tạo nhiều connection trong dev */
const ztteam_globalForPrisma = globalThis as unknown as {
  ztteam_prisma: PrismaClient | undefined;
};

function ztteam_createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

export const ztteam_prisma =
  ztteam_globalForPrisma.ztteam_prisma ?? ztteam_createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  ztteam_globalForPrisma.ztteam_prisma = ztteam_prisma;
}
