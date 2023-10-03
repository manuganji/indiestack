import { hasSessionCookie } from "@/auth";
import { SIGN_IN_PATH, SIGN_OUT_PATH, SIGN_UP_PATH } from "@/constants";
import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/serverUtils";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { PgMenuItems } from "zapatos/custom";
import { param, selectOne, self, sql } from "zapatos/db";
import { menus } from "zapatos/schema";

const DEFAULT_AUTH_MENU: PgMenuItems = [
	[
		{
			type: "link",
			label: "Home",
			path: "/",
		},
	],
	[
		{
			type: "post",
			label: "Logout",
			path: SIGN_OUT_PATH,
		},
	],
];

const DEFAULT_ANON_MENU: PgMenuItems = [
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
];
const getMenusForPath = cache(
	async ({
		pathname,
		menuType,
	}: {
		pathname: string;
		menuType: menus.JSONSelectable["type"];
	}) => {
		const property = await getCurrentProperty();
		const isAuth = hasSessionCookie(); // basic check because menus are generally not sensitive.

		const query = selectOne(
			"menus",
			{
				property: property.id,
				type: menuType,
				authenticated: isAuth,
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
		if (menu) {
			return menu;
		} else {
			return { items: isAuth ? DEFAULT_AUTH_MENU : DEFAULT_ANON_MENU };
		}
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
