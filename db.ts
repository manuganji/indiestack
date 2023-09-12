import { createPool } from "@vercel/postgres";
import pg from "pg";
import { DB_CONFIG, dev } from "./constants";

import {
  readCommitted,
  type Queryable,
  type SQLFragment,
  type TxnClientForReadCommitted,
} from "zapatos/db";

export function getPool() {
  const pool = dev
    ? new pg.Pool({
        connectionString: DB_CONFIG.connectionString,
      })
    : createPool(DB_CONFIG);
  // pool.on('error', (err) => {
  // 	pool = null;
  // 	console.error('Unexpected error on pool client');
  // });

  return pool;
}

export async function runQuery<T>(query: SQLFragment<T>) {
  const pool = getPool();
  // const client = await pool.connect();
  const res = await query.run(pool);
  await pool.end();
  return res;
  // client.release();
}

export async function runQueryTxn<T>(
  callback: (client: Queryable | TxnClientForReadCommitted) => Promise<T>
) {
  const pool = getPool();
  // const client = await pool.connect();
  const res = await readCommitted<T>(pool, callback);
  // client.release();
  await pool.end();
  return res;
}

// export function getNeon() {
//   return neon(DB_CONFIG.connectionString);
// }

// export function getQueue() {
//   return new QClient({
//     token: process.env.QSTASH_TOKEN,
//     retry: {
//       retries: 3,
//     },
//   });
// }

// if (dev) {
//   initDB();
// }
