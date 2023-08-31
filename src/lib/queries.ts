import { dev } from '$app/environment';
import { neon } from '@neondatabase/serverless';
import { createPool } from '@vercel/postgres';
import {
	readCommitted,
	type Queryable,
	type SQLFragment,
	type TxnClientForReadCommitted
} from 'zapatos/db';
import { generate } from 'zapatos/generate';
import { DB_CONFIG } from '../constants';
import { ZAPATOS_CONFIG } from '../constants';

let generated = !dev;

export async function initDB() {
	if (!generated) {
		// console.log('generating zapatos');
		await generate(ZAPATOS_CONFIG).then(() => {
			console.log('generated zapatos');
		});
		generated = true;
	}
}

export function getPool() {
	const pool = createPool(DB_CONFIG);
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

export function getNeon() {
	return neon(DB_CONFIG.connectionString);
}
