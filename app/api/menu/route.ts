import { SIGN_IN_PATH, SIGN_UP_PATH } from "@/constants";
import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/serverUtils";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { PgMenuItems } from "zapatos/custom";
import { param, selectOne, self, sql } from "zapatos/db";
import { menus } from "zapatos/schema";

const getMenusForPath = cache(
	async ({
		pathname,
		menuType,
	}: {
		pathname: string;
		menuType: menus.JSONSelectable["type"];
	}) => {
		const property = await getCurrentProperty();
		const query = selectOne(
			"menus",
			{
				property: property.id,
				type: menuType,
				path: sql<menus.SQL>`${self} @> ${param(
					pathname.replace("/", "").replaceAll("/", ".").replaceAll("-", "_"),
					"ltree",
				)}`,
			},
			{
				columns: ["items"],
				order: {
					by: sql`char_length(path::text)`,
					direction: "DESC",
				},
			},
		);
		const menu = await runQuery(query);
		return (
			menu || {
				items: [
					[
						{
							type: "link",
							label: "Home",
							path: "/",
						},
					],
					[
						{
							type: "button",
							label: "Login",
							path: SIGN_IN_PATH,
						},
						{
							type: "button",
							label: "Sign Up",
							path: SIGN_UP_PATH,
						},
					],
				] satisfies PgMenuItems,
			}
		);
	},
);

/**
 *
 * @param req
 * @param query: { pathname: string}
 * @returns {PgMenuItems}
 */
export const GET = async (req: NextRequest, { query }: RequestContext) => {
	const { pathname, menuType } = Object.fromEntries(
		req.nextUrl.searchParams.entries(),
	) as {
		pathname: string;
		menuType: menus.JSONSelectable["type"];
	};
	const menu = await getMenusForPath({ pathname, menuType });

	return NextResponse.json(menu.items);
};
