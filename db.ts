import { createPool } from "@vercel/postgres";
import { DB_CONFIG, dev } from "./constants";

import { Client as QClient } from "@upstash/qstash";

import * as zg from "zapatos/generate";
import { ZAPATOS_CONFIG } from "./constants";

let generated = !dev;

export function getQueue() {
  return new QClient({
    token: process.env.QSTASH_TOKEN,
    retry: {
      retries: 3,
    },
  });
}

export async function initDB() {
  if (!generated) {
    // console.log('generating zapatos');
    await zg.generate(ZAPATOS_CONFIG);
    generated = true;
  }
}
if (dev) {
  initDB();
}

export function getPool() {
  const pool = createPool(DB_CONFIG);
  // pool.on('error', (err) => {
  // 	pool = null;
  // 	console.error('Unexpected error on pool client');
  // });

  return pool;
}
