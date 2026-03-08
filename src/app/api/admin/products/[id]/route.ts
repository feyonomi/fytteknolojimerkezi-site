import { NextResponse } from "next/server";
import { ProductItem } from "@/types";
import { deleteProduct, updateProduct } from "@/lib/server-products";
import { isSafeAmount, sanitizeText } from "@/lib/validation";
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from "@/data/product-options";

const CATEGORIES: ProductItem["category"][] = PRODUCT_CATEGORIES;
const CONDITIONS: ProductItem["condition"][] = PRODUCT_CONDITIONS;

const normalizeByList = <T extends string>(value: string, options: T[]) => {
  const lower = value.toLocaleLowerCase("tr");
  return options.find((item) => item.toLocaleLowerCase("tr") === lower) || null;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = sanitizeText(id, 120);

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün kimliği." }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const name = sanitizeText(payload.name, 120);
  const rawCategory = sanitizeText(payload.category, 40);
  const rawCondition = sanitizeText(payload.condition, 40);
  const category = normalizeByList(rawCategory, CATEGORIES);
  const condition = normalizeByList(rawCondition, CONDITIONS);
  const imageUrl = sanitizeText(payload.imageUrl, 500) || null;
  const popular = Boolean(payload.popular);
  const isActive = payload.isActive === undefined ? true : Boolean(payload.isActive);
  const priceRaw = String(payload.price ?? "").replace(",", ".");
  const price = Number(priceRaw);

  if (name.length < 2) {
    return NextResponse.json({ error: "Ürün adı en az 2 karakter olmalıdır." }, { status: 400 });
  }

  if (!category) {
    return NextResponse.json({ error: "Geçersiz ürün kategorisi." }, { status: 400 });
  }

  if (!condition) {
    return NextResponse.json({ error: "Geçersiz ürün durumu." }, { status: 400 });
  }

  if (!isSafeAmount(price)) {
    return NextResponse.json({ error: "Geçersiz fiyat değeri." }, { status: 400 });
  }

  const result = await updateProduct(productId, {
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

    return NextResponse.json({ error: result.error || "Ürün güncellenemedi." }, { status: 500 });
  }

  return NextResponse.json({ product: result.product, message: "Ürün güncellendi." });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = sanitizeText(id, 120);

  if (!productId) {
    return NextResponse.json({ error: "Geçersiz ürün kimliği." }, { status: 400 });
  }

  const result = await deleteProduct(productId);

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Ürün silinemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Ürün silindi." });
}
