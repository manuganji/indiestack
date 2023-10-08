/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createExtension("citext", { ifNotExists: true });
	pgm.createTable("properties", {
		id: {
			type: "varchar(10)",
			primaryKey: true,
		},
		name: {
			type: "text",
			notNull: true,
		},
		domain: {
			type: "citext",
			unique: true,
			notNull: true,
		},
		email_from: {
			type: "citext",
			notNull: true,
		},
	});
	// block list to not spam emails
	pgm.createTable(
		"block_list",
		{
			property: {
				type: "varchar(10)",
				references: "properties(id)",
				notNull: true,
			},
			email: {
				type: "citext",
				primaryKey: true,
			},
			created_at: {
				type: "timestamptz",
				notNull: true,
				default: pgm.func("now()"),
			},
			active: {
				type: "boolean",
				notNull: true,
				default: true,
			},
			updated_at: {
				type: "timestamptz",
				notNull: true,
				default: pgm.func("now()"),
			},
		},
		{
			ifNotExists: true,
		},
	);
	pgm.createTable("users", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		welcomed: {
			type: "boolean",
			default: false,
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
		first_name: {
			type: "text",
			notNull: true,
		},
		last_name: {
			type: "text",
		},
		email: {
			type: "text",
			notNull: true,
		},
		email_verified: {
			type: "timestamptz",
			default: pgm.func("now()"),
		},
		image: {
			type: "text",
		},
	});
	pgm.createConstraint("users", "users_email_unique", {
		unique: ["property", "email"],
	});
	pgm.createTable("sessions", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		user_id: {
			type: "uuid",
			references: "users(id)",
			notNull: true,
		},
		expires: {
			type: "timestamptz",
			notNull: true,
		},
		session_token: {
			primaryKey: true,
			type: "uuid",
			notNull: true,
			default: pgm.func("gen_random_uuid()"),
		},
	});
	pgm.createTable("accounts", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
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
		type: {
			type: "text",
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
			type: "integer",
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
		property: {
			type: "varchar(10)",
			references: "properties(id)",
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
			notNull: true,
		},
	});
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
