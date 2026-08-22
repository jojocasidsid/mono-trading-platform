import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';

const database_url = process.env.DATABASE_URL;

if (!database_url) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({
  connectionString: database_url,
});

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
