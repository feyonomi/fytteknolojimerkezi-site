import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAppointment } from "@/lib/server-crm";
import { isValidPhone, sanitizeText } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `appointments:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json({ error: "Çok sık istek gönderildi." }, { status: 429 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = {
    fullName: sanitizeText(body.fullName, 80),
    phone: sanitizeText(body.phone, 20),
    service: sanitizeText(body.service, 80),
    appointmentAt: sanitizeText(body.appointmentAt, 40),
    reminder: Boolean(body.reminder),
    note: sanitizeText(body.note, 1000),
  };

  if (!payload.fullName || !isValidPhone(payload.phone) || !payload.service || !payload.appointmentAt) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const result = await createAppointment(payload);

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Randevu oluşturulamadı." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
