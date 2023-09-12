import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

import { getCurrentProperty } from "@/lib/serverUtils";
import { ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  // fetch data
  const property = await getCurrentProperty();

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={process.env.NEXT_PUBLIC_GLOBAL_LANG}>
      <body className={inter.className}>
        <div className="flex flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
