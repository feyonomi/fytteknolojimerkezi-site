import { NextResponse } from "next/server";
import { getRecentServiceOrders } from "@/lib/server-crm";

export async function GET() {
  const serviceOrders = await getRecentServiceOrders(20);
  return NextResponse.json({ serviceOrders });
}
