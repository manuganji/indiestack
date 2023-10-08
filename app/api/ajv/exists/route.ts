import { runQuery } from "@/db";
import { HttpStatusCode } from "axios";
import { isNil } from "lodash";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { selectOne } from "zapatos/db";
import { Table } from "zapatos/schema";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest, { query }: RequestContext) => {
	const { column, table, value } = query as {
		column: string;
		table: Table;
		value: string;
	};
	if (!column || !table || !value) {
		const res = new NextResponse("Missing parameters", {
			status: HttpStatusCode.BadRequest,
		});
		return res;
	}
	const res = await runQuery(
		selectOne(table, {
			[column]: value,
		}),
	);
	return NextResponse.json(isNil(res));
};
