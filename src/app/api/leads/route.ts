import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { isValidPhone, sanitizeText } from "@/lib/validation";

const leadTypes = ["second_hand", "print", "software", "contact", "offer"] as const;

type LeadType = (typeof leadTypes)[number];

const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(-10);

const toCanonicalPhone = (phone: string) => {
  const normalized = normalizePhone(phone);
  return normalized ? `0${normalized}` : phone.replace(/\D/g, "");
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({ key: `lead:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Çok sık istek gönderildi. Lütfen biraz sonra tekrar deneyin." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  const body = (await request.json()) as Record<string, unknown>;
  const type = sanitizeText(body.type, 30) as LeadType;
  const fullName = sanitizeText(body.fullName, 80);
  const phone = sanitizeText(body.phone, 20);
  const message = sanitizeText(body.message, 1500);
  const meta = typeof body.meta === "object" && body.meta ? body.meta : {};

  if (!leadTypes.includes(type)) {
    return NextResponse.json({ error: "Geçersiz talep tipi." }, { status: 400 });
  }

  if (!fullName || !isValidPhone(phone) || !message) {
    return NextResponse.json({ error: "Ad, telefon ve talep detayı zorunludur." }, { status: 400 });
  }

  const referenceCode = `FYT-LD-${Date.now().toString().slice(-8)}`;

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Veritabanı bağlantısı yapılandırılmamış." }, { status: 503 });
  }

  const canonicalPhone = toCanonicalPhone(phone);

  const profileQuery = await supabase.from("profiles").select("id").eq("phone", canonicalPhone).limit(1).maybeSingle();
  if (profileQuery.error) {
    return NextResponse.json({ error: "Müşteri profili doğrulanamadı." }, { status: 500 });
  }

  if (!profileQuery.data) {
    const profileInsert = await supabase.from("profiles").insert({
      full_name: fullName,
      phone: canonicalPhone,
      role: "customer",
    });

    if (profileInsert.error) {
      return NextResponse.json({ error: "Müşteri profili oluşturulamadı." }, { status: 500 });
    }
  }

  const insert = await supabase.from("lead_requests").insert({
    reference_code: referenceCode,
    lead_type: type,
    full_name: fullName,
    phone: canonicalPhone,
    message,
    meta: meta as object,
    source: "website",
    status: "Yeni",
  });

  if (insert.error) {
    return NextResponse.json({ error: "Talep kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, referenceCode });
}
