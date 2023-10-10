import type { Metadata } from "next";
import { Providers } from "./providers";

import NavMenu from "@/components/NavMenu";
import { getDomain } from "@/lib/domains";
import { runQuery } from "@/db";
import { select, all } from "zapatos/db";

type Props = {
	params: { d: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {
	// fetch data
	const property = await getDomain({ domain: params.d });

	// optionally access and extend (rather than replace) parent metadata
	// const previousImages = (await parent).openGraph?.images || [];

	return {
		title: property?.name,
		// openGraph: {
		//   images: ["/some-specific-page-image.jpg", ...previousImages],
		// },
	};
}

// export const generateStaticParams = async (): Promise<Array<{ d: string }>> => {
// 	const properties = await runQuery(select("properties", all, {}));
// 	return properties.map(({ domain }) => ({ d: domain }));
// };

export default async function RootLayout({
	children,
	params,
}: {
	params: { id: string };
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col">
			<Providers>
				<NavMenu />
				{children}
			</Providers>
		</div>
	);
}
