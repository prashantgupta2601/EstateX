import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as any

export const db =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
