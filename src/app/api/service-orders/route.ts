import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServiceOrder } from "@/lib/server-crm";
import { isValidPhone, sanitizeText } from "@/lib/validation";
import { sendServiceOrderWhatsappNotifications } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `service-orders:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json({ error: "Çok sık istek gönderildi." }, { status: 429 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = {
    fullName: sanitizeText(body.fullName, 80),
    phone: sanitizeText(body.phone, 20),
    device: sanitizeText(body.device, 120),
    issue: sanitizeText(body.issue, 1000),
  };

  if (!payload.fullName || !isValidPhone(payload.phone) || !payload.device || !payload.issue) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const result = await createServiceOrder(payload);
  if (!result.success) {
    return NextResponse.json({ error: result.error || "Arıza kaydı oluşturulamadı." }, { status: 500 });
  }

  void sendServiceOrderWhatsappNotifications({
    fullName: payload.fullName,
    customerPhone: payload.phone,
    device: payload.device,
    trackingCode: result.trackingCode,
  });

  return NextResponse.json({ ok: true, trackingCode: result.trackingCode });
}
