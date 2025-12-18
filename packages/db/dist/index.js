import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
// Prevent multiple instances in dev
const globalForPrisma = globalThis;
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
