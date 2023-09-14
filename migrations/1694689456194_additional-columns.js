/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.addColumns("users", {
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    last_logged_in: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
