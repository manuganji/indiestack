/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createDomain(
		{
			name: "property_settings",
			schema: "public",
		},
		{
			type: "jsonb",
		},
	);
	pgm.dropColumn("properties", "email_from");
	pgm.addColumn("properties", {
		settings: {
			type: "property_settings",
		},
	});
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.down = (pgm) => {
	pgm.dropColumn("properties", "settings");
	pgm.dropDomain({ name: "property_settings" });
	pgm.addColumn("properties", {
		email_from: {
			type: "varchar(255)",
		},
	});
};
