import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/admin-password";
import { ADMIN_SESSION_COOKIE, isAdminConfigured } from "@/lib/admin-session";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `admin-login:${ip}`, limit: 10, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json({ error: "Çok sık deneme yapıldı. Biraz sonra tekrar deneyin." }, { status: 429 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin erişimi henüz yapılandırılmamış." }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const password = sanitizeText(body.password, 200);

  if (!password) {
    return NextResponse.json({ error: "Şifre zorunludur." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, process.env.ADMIN_SESSION_TOKEN || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
