/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createTable("pages", {
		id: {
			type: "varchar(10)",
			primaryKey: true,
			notNull: true,
		},
		property: {
			type: "varchar(10)",
			references: "properties(id)",
			notNull: true,
		},
		title: {
			type: "text",
			notNull: true,
		},
		path: {
			type: "varchar(255)",
			notNull: true,
		},
		created_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("now()"),
		},
		updated_at: {
			type: "timestamptz",
			notNull: true,
			default: pgm.func("now()"),
		},
	});
	pgm.createConstraint("pages", "pages_path_unique", {
		unique: ["property", "path"],
	});
	pgm.createDomain("page_section_code", "varchar(255)");
	pgm.createTable("sections", {
		id: {
			type: "varchar(10)",
			primaryKey: true,
			notNull: true,
		},
		page: {
			type: "varchar(10)",
			references: "pages(id)",
			notNull: true,
		},
		order: {
			type: "float",
			notNull: true,
		},
		code: {
			type: "page_section_code",
			notNull: true,
		},
		config: {
			type: "jsonb",
			notNull: true,
			default: "{}",
		},
	});
  pgm.createConstraint('sections', 'sections_page_order_unique', {
    unique: ['page', 'order'],
  });
};

// /**
//  * @param {import('node-pg-migrate').MigrationBuilder} pgm
//  */
// exports.down = (pgm) => {};
