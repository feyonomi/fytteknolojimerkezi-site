import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-session";

const applySecurityHeaders = (response: NextResponse) => {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https://images.unsplash.com https://www.google.com https://maps.googleapis.com; script-src 'self' 'unsafe-inline' https://embed.tawk.to https://va.tawk.to; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://embed.tawk.to https://va.tawk.to; frame-src https://www.google.com https://maps.google.com; font-src 'self' data:; base-uri 'self'; form-action 'self';"
  );

  return response;
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/crm") || pathname.startsWith("/api/admin/");
  const isAdminLoginPage = pathname === "/admin-giris";
  const isAdminAuthApi = pathname === "/api/admin/login" || pathname === "/api/admin/logout";
  const isProtectedAdminApi = isAdminApi && !isAdminAuthApi;

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthorized = isAdminSessionValid(sessionToken);

  if ((isAdminPage || isProtectedAdminApi) && !isAuthorized) {
    if (isProtectedAdminApi) {
      return applySecurityHeaders(NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 }));
    }

    const loginUrl = new URL("/admin-giris", request.url);
    loginUrl.searchParams.set("next", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (isAdminLoginPage && isAuthorized) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)));
  }

  if (isAdminAuthApi && request.method !== "POST") {
    return applySecurityHeaders(NextResponse.json({ error: "Yöntem desteklenmiyor." }, { status: 405 }));
  }

  const response = NextResponse.next();

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest).*)"],
};
