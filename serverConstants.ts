import { ZAPATOS_CONFIG } from "./zapatos_utils.mjs";

export const DB_CONFIG = ZAPATOS_CONFIG.db;

import {} from "./constants";
export * from "./constants";

export const DEFAULT_TOKEN_DURATION: Duration = {
  hours: 12,
};

export const TOKEN_IDENTIFIER_COOKIE = 'token_identifier';