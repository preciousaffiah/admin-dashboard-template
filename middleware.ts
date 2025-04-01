import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
//   const host = req.headers.get("host") || "";
//   let subdomain = host.split(".")[0]; // Extract subdomain

//   // Handle localhost:3000 (no subdomains)
//   if (host.includes("localhost")) {
//     subdomain = "default-business"; // Set a fallback
//   }

//   if (
//     subdomain !== "servlette-saas" && // Ignore main domain
//     subdomain !== "www" // Ignore "www"
//   ) {
//     return NextResponse.rewrite(new URL(`/${subdomain}${req.nextUrl.pathname}`, req.url));
//   }

  return NextResponse.next();
}
