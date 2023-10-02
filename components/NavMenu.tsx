"use client";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { PgMenuItems } from "zapatos/custom";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { ModeToggle } from "./ModeToggle";

export default function NavMenu() {
	const pathname = usePathname();
	const [menuItems, setMenuItems] = useState<PgMenuItems>([]);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		fetch(`/api/menu/?pathname=${encodeURIComponent(pathname)}&menuType=header`)
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

	if (loading) {
		return <Skeleton className="w-full" />;
	}

	return (
		<div className="flex">
			<div className="flex justify-between px-2 flex-grow">
				{menuItems.map((subMenu, i) => {
					return (
						<NavigationMenu key={`menu${i}`}>
							<NavigationMenuList key={`menuList${i}`}>
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
				})}
			</div>
			<div className="place-self-end p-2">
				<ModeToggle />
			</div>
		</div>
	);
}
