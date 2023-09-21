"use client";
import classNames from "classnames";
import Link from "next/link";
import { redirect, useSelectedLayoutSegment } from "next/navigation";
import { PROPERTY_MENU, ROOT_MENU } from "./menus";

export default function SideBar({ isRoot }: { isRoot: boolean }) {
	const menu = isRoot ? ROOT_MENU : PROPERTY_MENU;
	const active = useSelectedLayoutSegment();
	if (!active) {
		redirect(menu[0].path);
	}
	// console.log("active", active);
	return (
		<div className="flex flex-col gap-2 p-4 w-1/6">
			{menu.map((item) => (
				<Link
					href={item.path}
					key={item.path}
					className={classNames(["px-4 py-2 rounded hover:bg-secondary"])}
				>
					{item.name}
				</Link>
			))}
		</div>
	);
}
