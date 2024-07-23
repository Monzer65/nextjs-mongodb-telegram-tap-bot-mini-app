import { NextRequest, NextResponse } from "next/server";
import { verifyAndRenewSession } from "./app/lib/auth";

export async function middleware(request: NextRequest) {
  const response = await verifyAndRenewSession(request);

  if (response.status === 401 || response.status === 500) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (response.status === 403) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Proceed with the original response if everything is fine
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
