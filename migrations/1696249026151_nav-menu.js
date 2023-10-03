/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createDomain(
		{
			name: "menu_items",
			schema: "public",
		},
		{
			type: "jsonb",
		},
	);
	pgm.createExtension("ltree", {
		ifNotExists: true,
	});
	pgm.createType("menu_type", ["header", "footer", "sidebar"]);
	pgm.createTable("menus", {
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		path: {
			type: "ltree",
			notNull: true,
			default: "",
		},
		authenticated: {
			type: "boolean",
			notNull: true,
			default: false,
		},
		type: {
			type: "menu_type",
			notNull: true,
		},
		items: {
			type: "menu_items",
			notNull: true,
			default: "[]",
		},
	});
	pgm.createConstraint("menus", "menus_path_type_auth_unique", {
		unique: ["property", "path", "type", "authenticated"],
	});
  pgm.createIndex('menus', 'path', { method: 'gist' });
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
