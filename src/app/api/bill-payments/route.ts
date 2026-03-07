import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createBillPayment } from "@/lib/server-crm";
import { isSafeAmount, isValidPhone, sanitizeText } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `bill-payments:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json({ error: "Çok sık istek gönderildi." }, { status: 429 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = {
    fullName: sanitizeText(body.fullName, 80),
    phone: sanitizeText(body.phone, 20),
    billType: sanitizeText(body.billType, 50),
    institution: sanitizeText(body.institution, 100),
    amount: Number(body.amount),
    note: sanitizeText(body.note, 1000),
    preferredMethod: sanitizeText(body.preferredMethod, 30),
  };

  if (!payload.fullName || !isValidPhone(payload.phone) || !payload.billType || !payload.institution || !isSafeAmount(payload.amount)) {
    return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const result = await createBillPayment(payload);
  if (!result.success) {
    return NextResponse.json({ error: result.error || "Talep kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
