import { NextResponse } from "next/server";
import { getServiceOrderStatus } from "@/lib/server-crm";

type RouteParams = {
  params: Promise<{ trackingCode: string }>;
};

export async function GET(_: Request, { params }: RouteParams) {
  const { trackingCode } = await params;
  const result = await getServiceOrderStatus(trackingCode);

  if (!result) {
    return NextResponse.json({ error: "Takip kodu bulunamadı." }, { status: 404 });
  }

  return NextResponse.json(result);
}
