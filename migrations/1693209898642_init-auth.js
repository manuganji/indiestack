/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("properties", {
    name: {
      type: "text",
      notNull: true,
    },
    domain: {
      type: "text",
      primaryKey: true,
    },
  });
  pgm.createTable("users", {
    domain: {
      type: "text",
      references: "properties(domain)",
      notNull: true,
    },
    is_admin: {
      type: "boolean",
    },
    id: {
      type: "uuid",
      unique: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "text",
      notNull: true,
    },
    email: {
      type: "text",
    },
    email_verified: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    image: {
      type: "text",
    },
  });
  pgm.createTable("sessions", {
    domain: {
      type: "uuid",
      notNull: true,
      references: "properties(id)",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
    },
    id: {
      type: "uuid",
      unique: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    expires: {
      type: "timestamptz",
    },
    session_token: {
      type: "uuid",
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },
  });
  pgm.createTable("accounts", {
    domain: {
      type: "text",
      references: "properties(domain)",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
    },
    id: {
      type: "uuid",
      unique: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },
    provider: {
      type: "text",
      notNull: true,
    },
    provider_account_id: {
      type: "text",
      notNull: true,
    },
    refresh_token: {
      type: "text",
    },
    access_token: {
      type: "text",
    },
    expires_at: {
      type: "timestamptz",
    },
    token_type: {
      type: "text",
    },
    scope: {
      type: "text",
    },
    id_token: {
      type: "text",
    },
    session_state: {
      type: "text",
    },
  });
  pgm.createTable("verification_tokens", {
    property_id: {
      type: "text",
      references: "properties(domain)",
      notNull: true,
    },
    identifier: {
      type: "text",
      notNull: true,
    },
    token: {
      type: "uuid",
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },
    expires: {
      type: "timestamptz",
    },
  });
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
