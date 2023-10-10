import { hasSessionCookie } from "@/auth";
import {
	SIDEBAR,
	SIGN_IN_PATH,
	SIGN_OUT_PATH,
	SIGN_UP_PATH,
} from "@/constants";
import { runQuery } from "@/db";
import { isRoot } from "@/lib/checks";
import { getDomain } from "@/lib/domains";
import { getHostName } from "@/lib/serverUtils";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { PgMenuItems } from "zapatos/custom";
import { param, selectOne, self, sql } from "zapatos/db";
import { menus } from "zapatos/schema";

export const preferredRegion = "home";

const DEFAULT_AUTH_MENU: PgMenuItems = [
	[
		{
			type: "link",
			label: "Home",
			path: "/",
		},
		{
			type: "link",
			label: "Dashboard",
			path: "/dash/",
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

const DEFAULT_ROOT_SIDEBAR_MENU: PgMenuItems = [
	[
		{
			type: "link",
			label: "Properties",
			path: "/dash/properties",
			desc: "Manage your properties",
		},
		{
			type: "link",
			label: "Users",
			path: "/dash/users",
		},
		{
			type: "link",
			label: "Pages",
			path: "/dash/pages",
		},
	],
];

const DEFAULT_REGULAR_SIDEBAR_MENU: PgMenuItems = [
	[
		{
			type: "link",
			label: "Pages",
			path: "/dash/pages",
		},
		{
			type: "link",
			label: "Users",
			path: "/dash/users",
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
		const property = await getDomain({ domain: getHostName() });
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
		} else if (menuType === SIDEBAR) {
			if (isRoot()) {
				return { items: DEFAULT_ROOT_SIDEBAR_MENU };
			} else {
				return { items: DEFAULT_REGULAR_SIDEBAR_MENU };
			}
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
