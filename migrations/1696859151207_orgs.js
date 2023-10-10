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
		name: {
			type: "varchar(255)",
			notNull: true,
		},
		desc: {
			type: "text",
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
	pgm.createTable("org_roles", {
		role: {
			type: "org_role",
			notNull: true,
			primaryKey: true,
		},
		title: {
			type: "varchar(255)",
			notNull: true,
		},
		desc: {
			type: "text",
		},
	});
	// There can be multiple roles for a user in an org
	pgm.createConstraint("org_members", "org_members_org_user_role_unique", {
		unique: ["org", "user", "role"],
	});
	// create orgs for all existing users;
	pgm.sql(`
    INSERT INTO orgs (property, id, name)
    SELECT property, substr(id::text, 1, 8), 'Personal' FROM users
  `);
	// add defaultRoles to properties
	pgm.sql(`
    UPDATE properties SET settings = jsonb_set(settings, '{auth,defaultRoles}', '["admin.user"]')
  `);
	// create org_members for all existing users;
	pgm.sql(`
    INSERT INTO org_members 
    SELECT substr(id::text, 1, 8) as org, id as user, 'admin.user' as role FROM users
  `);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
	pgm.dropConstraint("org_members", "org_members_org_user_role_unique");
	pgm.dropTable("org_members");
	pgm.dropTable("org_roles");
	pgm.dropTable("orgs");
	pgm.dropDomain("org_role");
};
