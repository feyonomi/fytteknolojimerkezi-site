import { NextResponse } from "next/server";
import { ProductItem } from "@/types";
import { createProduct, getAdminProducts } from "@/lib/server-products";
import { isSafeAmount, sanitizeText } from "@/lib/validation";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from "@/data/product-options";

const CATEGORIES: ProductItem["category"][] = PRODUCT_CATEGORIES;
const CONDITIONS: ProductItem["condition"][] = PRODUCT_CONDITIONS;

export async function GET() {
  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const name = sanitizeText(payload.name, 120);
  const category = sanitizeText(payload.category, 20) as ProductItem["category"];
  const condition = sanitizeText(payload.condition, 20) as ProductItem["condition"];
  const imageUrl = sanitizeText(payload.imageUrl, 500) || null;
  const popular = Boolean(payload.popular);
  const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);
  const price = Number(payload.price);

  if (name.length < 2) {
    return NextResponse.json({ error: "Ürün adı en az 2 karakter olmalıdır." }, { status: 400 });
  }

  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Geçersiz ürün kategorisi." }, { status: 400 });
  }

  if (!CONDITIONS.includes(condition)) {
    return NextResponse.json({ error: "Geçersiz ürün durumu." }, { status: 400 });
  }

  if (!isSafeAmount(price)) {
    return NextResponse.json({ error: "Geçersiz fiyat değeri." }, { status: 400 });
  }

  const result = await createProduct({
    name,
    category,
    condition,
    price,
    imageUrl,
    popular,
    isActive,
  });

  if (!result.product) {
    if (result.code === "23505") {
      return NextResponse.json(
        { error: "Aynı isim, kategori, durum ve fiyat ile kayıtlı ürün zaten var." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: result.error || "Ürün eklenemedi." }, { status: 500 });
  }

  return NextResponse.json({ product: result.product, message: "Ürün başarıyla eklendi." }, { status: 201 });
}
