import { NextRequest, NextResponse } from "next/server";
import { findCustomerRecord } from "@/lib/server-crm";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone") || "";
  if (!phone.trim()) {
    return NextResponse.json({ error: "Telefon numarası giriniz." }, { status: 400 });
  }

  const customer = await findCustomerRecord(phone);
  if (!customer) {
    return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ customer });
}
