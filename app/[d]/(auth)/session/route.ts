import { getUserOnServer } from "@/lib/serverUtils";
import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse> => {
	const res = await getUserOnServer();
	return NextResponse.json(res);
};
