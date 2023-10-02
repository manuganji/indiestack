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
  })
  pgm.createType("menu_type", ["header", "footer"]);
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
    type: {
      type: "menu_type",
      notNull: true, 
    },
    name: {
      type: "text",
      notNull: true,
    },
    items: {
      type: "menu_items",
      notNull: true,
      default: "[]",
    }
  })
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
