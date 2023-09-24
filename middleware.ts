import { NextRequest, NextResponse } from "next/server";
import { dev } from "./constants";

export function middleware(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
    default-src 'self';
    script-src 'self' ${
					dev ? "'unsafe-eval'" : " 'strict-dynamic'"
				} 'nonce-${nonce}';
    style-src 'self' '${dev ? "unsafe-inline" : "nonce-${nonce}"}' ;
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

	const resp = NextResponse.next({
		request,
	});

	resp.headers.set("x-nonce", nonce);
	if (!resp.headers.has("Content-Security-Policy")) {
		resp.headers.set(
			"Content-Security-Policy",
			// Replace newline characters and spaces
			cspHeader.replace(/\s{2,}/g, " ").trim(),
		);
	}
	return resp;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
