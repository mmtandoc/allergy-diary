import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma || new PrismaClient({ log: ["query", "warn", "error"] })

if (process.env.NODE_ENV !== "production") global.prisma = prisma
/*
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    })
  }
  prisma = global.prisma
}
export default prisma*/
