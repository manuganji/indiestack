/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(
    "properties",
    {
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
      domain: {
        type: "text",
      },
    },
    {
      constraints: {
        unique: ["id", "domain"],
      },
      ifNotExists: true,
    }
  );
  pgm.createTable("users", {
    property_id: {
      type: "uuid",
      references: "properties(id)",
      notNull: true,
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
    property_id: {
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
    property_id: {
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
      type: "uuid",
      notNull: true,
      references: "properties(id)",
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
