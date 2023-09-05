import { Config } from "zapatos/generate";

export const dev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

export const preview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export const prod = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

export const ZAPATOS_CONFIG: Config = {
  db: {
    connectionString: process.env.POSTGRES_URL,
  },
  schemas: {
    public: {
      include: "*",
      exclude: [
        "geography_columns",
        "geometry_columns",
        "raster_columns",
        "raster_overviews",
        "spatial_ref_sys",
      ],
    },
  },
  outDir: ".",
  customTypesTransform: "PgMyType",
};

export const DB_CONFIG = ZAPATOS_CONFIG.db;

export const WIDGET_IDS = {
  COVER: 1,
  BENEFITS: 2,
  TESTIMONIALS: 3
}