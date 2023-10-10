/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createDomain("feature_code", "ltree"); // There can be a hierarchy of features
	pgm.createTable("features", {
		title: {
			type: "varchar(255)",
			notNull: true,
      unique: true,
		},
		desc: {
			type: "text",
		},
		code: {
			type: "feature_code",
			notNull: true,
			unique: true,
		},
	});
	pgm.createTable("feature_flags", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		feature: {
			type: "feature_code",
			notNull: true,
		},
		status: {
			type: "boolean",
			default: true,
		},
	});
	pgm.createConstraint(
		"feature_flags",
		"feature_flags_property_feature_unique",
		{
			unique: ["property", "feature"],
		},
	);
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
