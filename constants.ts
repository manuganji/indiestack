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

// Auth Settings
export const DEFAULT_AUTH_DURATION = {
  days: 7,
};

export const LONG_AUTH_DURATION = {
  days: 180,
};

export const EMAIL_COOKIE = "auth-email";
export const SESSION_COOKIE = "session_token";
export const LOCAL_USER = "local-user";
export const LONG_SESSION_COOKIE = "long-session";
export const SECS_IN_DAY = 86400;

export const SIGN_UP_PATH = '/sign-up';
export const SIGN_IN_PATH = '/sign-in';
export const SIGN_OUT_PATH = '/sign-out';
export const SESSION_PATH = '/session';


export const WIDGET_IDS = {
  COVER: 1,
  BENEFITS: 2,
  TESTIMONIALS: 3,
};
