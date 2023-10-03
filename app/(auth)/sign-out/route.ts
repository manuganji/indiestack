import { logUserOut } from "@/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	await logUserOut();
	const nextUrl = req.nextUrl.clone();
	nextUrl.pathname = "/";
	return NextResponse.redirect(nextUrl, {
		status: HttpStatusCode.SeeOther,
	});
};
