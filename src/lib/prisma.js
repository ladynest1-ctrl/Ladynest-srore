// lib/prisma.js
import { PrismaClient } from "@prisma/client";

// Global variable ko declare karna Next.js environment mein
const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error"], // Taake terminal mein queries aur errors nazar aayen
  });

// Production ke ilawa hamesha global instance use karein taake connections limit cross na ho
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
