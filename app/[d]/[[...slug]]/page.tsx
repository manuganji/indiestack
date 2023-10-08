// check if any page for the request
// show 404

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { runQuery } from "@/db";
import { getHostName } from "@/lib/serverUtils";
import { parent, select, selectExactlyOne, selectOne } from "zapatos/db";
import { Fragment, cache } from "react";
import { notFound } from "next/navigation";
import { components } from "@/components/sections";
import { Metadata, ResolvingMetadata } from "next";
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamic = "auto";
export async function generateStaticParams() {
	return ["home", "about"];
}
// if (dev) {
//   initDB();
// }

const getPage = cache(async (path: string) => {
	const hostName = getHostName();
	const { page, ...property } = await runQuery(
		selectExactlyOne(
			"properties",
			{
				domain: hostName,
			},
			{
				columns: ["id", "name"],
				lateral: {
					page: selectOne(
						"pages",
						{
							property: parent("id"),
							path,
						},
						{
							lateral: {
								sections: select(
									"sections",
									{
										page: parent("id"),
									},
									{
										order: {
											by: "order",
											direction: "ASC",
										},
									},
								),
							},
						},
					),
				},
			},
		),
	);
	if (!page) {
		return { property };
	}
	const { sections, ...rest } = page;
	return { page: rest, sections, property };
});

export async function generateMetadata(
	{ params }: { params: { slug: string[] } },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const pageOnDB = await getPage(params.slug?.join("/") || "");
	// console.log(pageOnDB);
	return {
		title: pageOnDB?.page?.title || pageOnDB?.property?.name,
		// openGraph: {
		//   images: ["/some-specific-page-image.jpg", ...previousImages],
		// },
	};
}

export default async function Home({
	params,
}: {
	params: {
		domain: string;
		slug?: string[];
	};
}) {
	const pageOnDB = await getPage(params.slug?.join("/") || "");
	if (!pageOnDB) {
		notFound();
	}
	const { page, sections } = pageOnDB;
	// console.log(params);
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			{sections?.map((section) => (
				<Fragment key={section.id}>
					{/* @ts-ignore */}
					{components[section.code].Component(section.config)}
				</Fragment>
			))}
		</main>
	);
}
