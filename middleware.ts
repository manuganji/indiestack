import { NextRequest, NextResponse } from "next/server";
import { dev } from "./constants";

export function middleware(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
    default-src 'self';
    script-src 'self' ${
					dev ? "'unsafe-eval'" : "'strict-dynamic'"
				} 'nonce-${nonce}';
    style-src 'self' '${dev ? "unsafe-inline" : "nonce-${nonce}"}' ;
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    ${dev ? "" : "upgrade-insecure-requests"};
	`;

	const hostname = request.headers.get("host")!;

	const { pathname } = request.nextUrl;
	request.headers.set("x-pathname", pathname);
	// share nonce with the downstream code
	request.headers.set("x-nonce", nonce);

	const resp = NextResponse.rewrite(
		new URL(`/${hostname}${pathname}`, request.url),
	);
	// resp.headers.delete('x-pathname');

	// add CSP header if not already present
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
