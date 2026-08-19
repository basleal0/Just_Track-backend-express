import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// Instantiate connection pool once
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Export single shared Prisma instance
export const prisma = new PrismaClient({ adapter });