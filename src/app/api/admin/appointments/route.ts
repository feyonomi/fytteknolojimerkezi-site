import { NextResponse } from "next/server";
import { getRecentAppointments } from "@/lib/server-crm";

export async function GET() {
  const appointments = await getRecentAppointments(20);
  return NextResponse.json({ appointments });
}
