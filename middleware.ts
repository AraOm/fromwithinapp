import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionAndProfile } from "./src/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const { session, profile, subscription } = await getSessionAndProfile(req);

  if (!session && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/welcome";
    return NextResponse.redirect(url);
  }

  if (session) {
    const needsWearable = !profile?.wearable_connected;
    const hasAccess = subscription?.status === "trialing" || subscription?.status === "active";

    if ((needsWearable || !hasAccess) && pathname !== "/onboarding") {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };
