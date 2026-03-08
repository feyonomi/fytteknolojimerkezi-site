import { NextResponse } from "next/server";
import { getRecentContactLeads } from "@/lib/server-crm";

export async function GET() {
  const leads = await getRecentContactLeads(20);
  return NextResponse.json({ leads });
}
