import prisma from "./lib/prisma"
import { PrismaTransaction } from "./types/prisma-transaction"
import { prismaNonExistentId } from "./types/non-existent-id"

export { prisma, prismaNonExistentId }
export type { PrismaTransaction }
