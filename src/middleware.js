import { NextResponse, NextRequest } from "next/server";

export async function middleware(request) {
  const authToken = request.cookies.get("next-auth.session-token")?.value;

  const loggedInUserNotAccessPaths = request.nextUrl.pathname === "/login";

  if (loggedInUserNotAccessPaths) {
    if (authToken) {
      var response;
      const originalUrl = request.cookies.get("original_url");
      console.log(originalUrl, "this is original url");
      if (
        originalUrl === "undefined" ||
        originalUrl === null ||
        originalUrl === undefined
      ) {
        response = NextResponse.redirect(new URL("/admin", request.url));
      } else {
        response = NextResponse.redirect(
          new URL(originalUrl?.value, request.url)
        );
      }

      response.cookies.set("original_url", "", { path: "/", maxAge: 0 });
      return response;
    }
  } else {
    if (!authToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("original_url", request.nextUrl.href, {
        path: "/",
        maxAge: 3 * 60 * 1000,
      }); // Expires after 3 minutes
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login/:path*", "/admin/:path*"],
};
