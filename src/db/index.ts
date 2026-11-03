import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

const databaseUrl = process.env.DATABASE_URL;
const legacyConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
};

if (!databaseUrl && Object.values(legacyConfig).some((value) => !value)) {
  throw new Error('Database configuration is missing. Set DATABASE_URL or SQL_HOST, SQL_USER, SQL_PASSWORD, and SQL_DB_NAME.');
}

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      max: Number(process.env.SQL_POOL_MAX || 10),
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 30_000,
      ...(process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
    }
  : {
      ...legacyConfig,
      max: Number(process.env.SQL_POOL_MAX || 10),
      connectionTimeoutMillis: 15_000,
      idleTimeoutMillis: 30_000,
      ...(process.env.DATABASE_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}),
    };

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool(poolConfig);
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err.message);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
