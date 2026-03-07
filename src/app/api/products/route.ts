import { NextResponse } from "next/server";
import { getProducts } from "@/lib/server-products";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
