import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
import { select, selectOne } from "zapatos/db";
import { runQuery } from "./queries";
// import ws from "ws";
// import { neonConfig } from "@neondatabase/serverless";
// neonConfig.webSocketConstructor = ws; // <-- this is the key bit

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "";

  console.log("hostname", hostname);
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  console.log("path", path);
  const query = selectOne("properties", {
    domain: hostname,
  });
  // if (hostname === "localhost:3000") {
  //   return NextResponse.next();
  // }

  const res = await runQuery(query);

  /**
   * get property from domain
   *
   */
  // rewrite everything else to `/[domain]/[path] dynamic route
  const newURL = new URL(`${res?.id || "root"}${path}`, req.url);
  return NextResponse.rewrite(newURL);
}
