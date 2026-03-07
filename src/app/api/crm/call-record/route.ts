import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createCallRecord } from "@/lib/server-crm";
import { isValidPhone, sanitizeText } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `crm-call:${ip}`, limit: 30, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json({ error: "Çok sık istek gönderildi." }, { status: 429 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const phone = sanitizeText(payload.phone, 20);
  const summary = sanitizeText(payload.summary, 1000);
  const staff = sanitizeText(payload.staff, 80);

  if (!isValidPhone(phone) || !summary || !staff) {
    return NextResponse.json({ error: "Eksik alan var." }, { status: 400 });
  }

  const customer = await createCallRecord(phone, summary, staff);
  if (!customer) {
    return NextResponse.json({ error: "Çağrı kaydı eklenemedi." }, { status: 500 });
  }

  return NextResponse.json({ customer });
}
