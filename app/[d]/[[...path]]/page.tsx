import { runQuery } from "@/db";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { all, parent, select, selectExactlyOne } from "zapatos/db";
import RenderSections from "./RenderSections";
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamic = "auto";
export const revalidate = 60;
export const preferredRegion = "home";

export const generateStaticParams = async (): Promise<
	Array<{ d: string; path: null | string }>
> => {
	const properties = await runQuery(
		select("properties", all, {
			columns: ["domain"],
		}),
	);
	const params = properties.map(({ domain }) => ({ d: domain, path: null }));
	// console.log("static params", params);
	return params;
	// const property = await runQuery(
	// 	selectExactlyOne(
	// 		"properties",
	// 		{
	// 			domain: d,
	// 		},
	// 		{
	// 			lateral: {
	// 				pages: select(
	// 					"pages",
	// 					{
	// 						property: parent("id"),
	// 					},
	// 					{
	// 						columns: ["path"],
	// 						limit: 2,
	// 					},
	// 				),
	// 			},
	// 		},
	// 	),
	// );
	// const params = property.pages.map(({ path }) => ({
	// 	params: { d, slug: path },
	// }));
	// console.log("static params", d, params);
	// return params;
};

// if (dev) {
//   initDB();
// }

const getPage = cache(async (path: string, domain: string) => {
	// check if any page for the request
	// show 404
	// console.log("Generating", path, domain);
	const { page, ...property } = await runQuery(
		selectExactlyOne(
			"properties",
			{
				domain: decodeURIComponent(domain),
			},
			{
				columns: ["id", "name"],
				lateral: {
					page: selectExactlyOne(
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
	{ params }: { params: { path: string[]; d: string } },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const pageOnDB = await getPage(params.path?.join("/") || "", params.d);
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
		d: string;
		path?: string[];
	};
}) {
	const pageOnDB = await getPage(params.path?.join("/") || "", params.d);
	if (!pageOnDB) {
		notFound();
	}
	const { sections } = pageOnDB;
	// console.log(params);
	return (
		<main className="flex min-h-screen flex-col p-24">
			{sections ? <RenderSections sections={sections} /> : null}
		</main>
	);
}
