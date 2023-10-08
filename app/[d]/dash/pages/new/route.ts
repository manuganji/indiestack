import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/domains";
import { getHostName } from "@/lib/serverUtils";
import { shortId } from "@/lib/utils";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { insert, sql } from "zapatos/db";

export const POST = async (req: NextRequest) => {
	const property = await getCurrentProperty({ domain: getHostName() });
	const newPage = await runQuery(
		insert("pages", {
			property: property.id,
			title: "New Page",
			id: shortId(10),
			path: sql`gen_random_uuid()`,
		}),
	);

	const redUrl = req.nextUrl.clone();
	redUrl.pathname = `/dash/pages/${newPage.id}`;
	return NextResponse.redirect(redUrl, {
		status: HttpStatusCode.SeeOther,
	});
};
