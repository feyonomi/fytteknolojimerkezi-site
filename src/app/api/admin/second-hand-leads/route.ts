import { NextResponse } from "next/server";
import { getRecentSecondHandLeads } from "@/lib/server-crm";

export async function GET() {
  const leads = await getRecentSecondHandLeads(20);
  return NextResponse.json({ leads });
}
