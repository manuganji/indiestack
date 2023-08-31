import type { Config } from 'zapatos/generate';
import { env } from '$env/dynamic/private';

export const preview = env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

export const prod = env.NEXT_PUBLIC_VERCEL_ENV === 'production';

export const ZAPATOS_CONFIG: Config = {
	db: {
		connectionString: env.POSTGRES_URL
	},
	schemas: {
		public: {
			include: '*',
			exclude: [
				'geography_columns',
				'geometry_columns',
				'raster_columns',
				'raster_overviews',
				'spatial_ref_sys'
			]
		}
	},
	outDir: '.',
	customTypesTransform: 'PgMyType'
};

export const DB_CONFIG = ZAPATOS_CONFIG.db;
