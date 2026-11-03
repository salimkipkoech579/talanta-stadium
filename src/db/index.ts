import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/talanta_stadium';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      connectionString: databaseUrl,
      max: Number(process.env.SQL_POOL_MAX || 10),
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 30_000,
      ...(process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err.message);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
