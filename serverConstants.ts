import { ZAPATOS_CONFIG } from "./zapatos_utils.mjs";

export const DB_CONFIG = ZAPATOS_CONFIG.db;
export * from "./constants";

// Auth Settings
export const DEFAULT_AUTH_DURATION = {
  days: 7,
};

export const LONG_AUTH_DURATION = {
  days: 180,
};

export const DEFAULT_TOKEN_DURATION: Duration = {
  hours: 12,
};

export const TOKEN_IDENTIFIER_COOKIE = 'token_identifier';