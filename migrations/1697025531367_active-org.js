/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.addColumns("users", {
		last_org: {
			type: "varchar(10)",
			references: "orgs(id)", // This is the org that the user was last active in
		},
	});
	pgm.addColumns("sessions", {
		org: {
			type: "varchar(10)",
			references: "orgs(id)",
		},
	});
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
