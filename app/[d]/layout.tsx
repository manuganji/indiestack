import type { Metadata } from "next";
import { Providers } from "./providers";

import NavMenu from "@/components/NavMenu";
import { getCurrentProperty } from "@/lib/serverUtils";

type Props = {
	params: { d: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {
	// fetch data
	const property = await getCurrentProperty({ domain: params.d });

	// optionally access and extend (rather than replace) parent metadata
	// const previousImages = (await parent).openGraph?.images || [];

	return {
		title: property?.name,
		// openGraph: {
		//   images: ["/some-specific-page-image.jpg", ...previousImages],
		// },
	};
}

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
