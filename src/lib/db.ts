import { createPool } from "@vercel/postgres";
import { DB_CONFIG } from "../constants";

import { Client as QClient } from "@upstash/qstash";




export function getQueue() {
  return new QClient({
    token: process.env.QSTASH_TOKEN,
    retry: {
      retries: 3,
    },
  });
}


export function getPool() {
  const pool = createPool(DB_CONFIG);
  // pool.on('error', (err) => {
  // 	pool = null;
  // 	console.error('Unexpected error on pool client');
  // });

  return pool;
}
