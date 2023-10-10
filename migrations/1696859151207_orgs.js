/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createTable("orgs", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		id: {
			type: "varchar(10)",
			notNull: true,
			primaryKey: true,
		},
	});
	pgm.createDomain("org_role", "ltree"); // There can be a hierarchy of roles
	pgm.createTable("org_members", {
		org: {
			type: "varchar(10)",
			references: "orgs(id)",
			notNull: true,
		},
		user: {
			type: "uuid",
			references: "users(id)",
			notNull: true,
		},
		role: {
			type: "org_role",
			notNull: true,
		},
	});
	// There can be multiple roles for a user in an org
	pgm.createConstraint("org_members", "org_members_org_user_role_unique", {
		unique: ["org", "user", "role"],
	});
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
