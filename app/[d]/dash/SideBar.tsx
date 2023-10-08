"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SIDEBAR } from "@/constants";
import Link from "next/link";
import {
	redirect,
	usePathname,
	useSelectedLayoutSegment,
} from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { PgMenuItems } from "zapatos/custom";

export default function SideBar({ isRoot }: { isRoot: boolean }) {
	const pathname = usePathname();
	const [menuItems, setMenuItems] = useState<PgMenuItems>([]);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		fetch(
			`/api/menu/?pathname=${encodeURIComponent(pathname)}&menuType=${SIDEBAR}`,
		)
			.then<PgMenuItems>((res) => res.json())
			.then((res) => {
				setMenuItems(res);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [pathname]);
	const active = useSelectedLayoutSegment();
	const firstLink = menuItems?.[0]?.find((item) => item.type === "link");
	if (!active && firstLink) {
		// @ts-ignore
		redirect(firstLink.path);
	}
	// console.log("active", active);
	return (
		<div className="flex flex-col gap-2 p-4 w-1/6">
			{loading ? (
				<Fragment>
					<div className="flex flex-col gap-2 w-full justify-between">
						<Skeleton className="w-full bg-gray-300 rounded-lg my-auto h-4" />
						<Skeleton className="w-full bg-gray-300 rounded-lg my-auto h-4" />
						<Skeleton className="w-full bg-gray-300 rounded-lg my-auto h-4" />
						<Skeleton className="w-full bg-gray-300 rounded-lg my-auto h-4" />
					</div>
					<Skeleton className="w-full bg-gray-300 rounded-lg my-auto h-6" />
				</Fragment>
			) : (
				menuItems.map((subMenu, i) => {
					return (
						<NavigationMenu
							key={`menu${i}`}
							orientation="vertical"
							className="flex-col justify-start"
						>
							<NavigationMenuList
								key={`menuList${i}`}
								className="flex-col items-start justify-start gap-2 space-x-0"
							>
								{subMenu
									.map((item, j) => {
										switch (item.type) {
											case "link":
												return (
													<NavigationMenuLink href={item.path}>
														{item.label}
													</NavigationMenuLink>
												);
											case "dropdown":
												return (
													<Fragment>
														<NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
														<NavigationMenuContent>
															{item.items.map((subItem, k) => (
																<NavigationMenuLink key={`menu${i}${k}`} href={subItem.path}>
																	{subItem.label}
																</NavigationMenuLink>
															))}
														</NavigationMenuContent>
													</Fragment>
												);
											case "button":
												return (
													<Button asChild>
														{/* @ts-ignore */}
														<Link href={item.path}>{item.label}</Link>
													</Button>
												);
											case "post":
												return (
													<form action={item.path} method="POST">
														<Button type="submit">{item.label}</Button>
													</form>
												);
											default:
												return null;
										}
									})
									.map((node, j) => (
										<NavigationMenuItem key={`menu${i}${j}`}>{node}</NavigationMenuItem>
									))}
							</NavigationMenuList>
						</NavigationMenu>
					);
				})
				// menu.map((item) => (
				// 	<Link
				// 		href={item.path}
				// 		key={item.path}
				// 		className={classNames(["px-4 py-2 rounded hover:bg-secondary"])}
				// 	>
				// 		{item.name}
				// 	</Link>
				// ))
			)}
		</div>
	);
}
