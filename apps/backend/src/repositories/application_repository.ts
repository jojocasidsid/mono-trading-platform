import type { Prisma, PrismaClient } from '../generated/prisma/client.js';
import prisma from '../lib/prisma.js';

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export abstract class ApplicationRepository {
  protected readonly db: DatabaseClient;

  constructor(db: DatabaseClient = prisma) {
    this.db = db;
  }
}
