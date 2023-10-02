import { SIGN_IN_PATH, SIGN_UP_PATH } from "@/constants";
import { runQuery } from "@/db";
import { headers } from "next/headers";
import { cache } from "react";
import { PgMenuItems } from "zapatos/custom";
import { conditions, param, selectOne, self, sql, vals } from "zapatos/db";
import { menus } from "zapatos/schema";
import NavMenu from "./NavMenu";



export default async function ServerNavMenu() {
	const pathname = headers().get("x-pathname");
	console.log("pathname", pathname);
	const menu = await getMenuForPath(pathname!);
	const items = menu.items;
	return <NavMenu menuItems={items} />;
}
