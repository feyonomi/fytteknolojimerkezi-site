import { ProductItem } from "@/types";
import { createAdminSupabaseClient } from "@/lib/supabase";

type ProductRow = {
  id: string;
  name: string;
  category: ProductItem["category"];
  condition: ProductItem["condition"];
  price: number;
  image_url: string | null;
  popular: boolean;
  is_active: boolean;
};

export type AdminProductItem = ProductItem & {
  isActive: boolean;
};

export type CreateProductInput = {
  name: string;
  category: ProductItem["category"];
  condition: ProductItem["condition"];
  price: number;
  imageUrl?: string | null;
  popular?: boolean;
  isActive?: boolean;
};

const mapProductRow = (item: ProductRow): AdminProductItem => ({
  id: item.id,
  name: item.name,
  category: item.category,
  condition: item.condition,
  price: Number(item.price),
  imageUrl: item.image_url,
  popular: item.popular,
  isActive: item.is_active,
});

export async function getProducts(): Promise<ProductItem[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const query = await supabase
    .from("products")
    .select("id, name, category, condition, price, image_url, popular, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!query.error && query.data) {
    return (query.data as ProductRow[]).map((item) => {
      const mapped = mapProductRow(item);
      return {
        id: mapped.id,
        name: mapped.name,
        category: mapped.category,
        condition: mapped.condition,
        price: mapped.price,
        imageUrl: mapped.imageUrl,
        popular: mapped.popular,
      };
    });
  }

  const fallbackQuery = await supabase
    .from("products")
    .select("id, name, category, condition, price, popular, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!fallbackQuery.error && fallbackQuery.data) {
    return (fallbackQuery.data as Omit<ProductRow, "image_url">[]).map((item) => {
      const mapped = mapProductRow({ ...item, image_url: null });
      return {
        id: mapped.id,
        name: mapped.name,
        category: mapped.category,
        condition: mapped.condition,
        price: mapped.price,
        imageUrl: mapped.imageUrl,
        popular: mapped.popular,
      };
    });
  }

  const legacyWithImage = await supabase
    .from("products")
    .select("id, name, category, condition, price, image_url")
    .order("created_at", { ascending: false });

  if (!legacyWithImage.error && legacyWithImage.data) {
    return (legacyWithImage.data as Array<{
      id: string;
      name: string;
      category: ProductItem["category"];
      condition: ProductItem["condition"];
      price: number;
      image_url: string | null;
    }>).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      condition: item.condition,
      price: Number(item.price),
      imageUrl: item.image_url,
      popular: false,
    }));
  }

  const legacyQuery = await supabase
    .from("products")
    .select("id, name, category, condition, price")
    .order("created_at", { ascending: false });

  if (legacyQuery.error || !legacyQuery.data) {
    return [];
  }

  return (legacyQuery.data as Array<{
    id: string;
    name: string;
    category: ProductItem["category"];
    condition: ProductItem["condition"];
    price: number;
  }>).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    condition: item.condition,
    price: Number(item.price),
    imageUrl: null,
    popular: false,
  }));
}

export async function getAdminProducts(): Promise<AdminProductItem[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const query = await supabase
    .from("products")
    .select("id, name, category, condition, price, image_url, popular, is_active")
    .order("created_at", { ascending: false });

  if (query.error) {
    const fallbackQuery = await supabase
      .from("products")
      .select("id, name, category, condition, price")
      .order("created_at", { ascending: false });

    if (fallbackQuery.error || !fallbackQuery.data) {
      return [];
    }

    return (fallbackQuery.data as Array<{
      id: string;
      name: string;
      category: ProductItem["category"];
      condition: ProductItem["condition"];
      price: number;
    }>).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      condition: item.condition,
      price: Number(item.price),
      imageUrl: null,
      popular: false,
      isActive: true,
    }));
  }

  if (!query.data) {
    return [];
  }

  return (query.data as ProductRow[]).map(mapProductRow);
}

export async function createProduct(input: CreateProductInput) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { product: null, error: "Veritabanı bağlantısı bulunamadı." };
  }

  const insertResult = await supabase
    .from("products")
    .insert({
      name: input.name,
      category: input.category,
      condition: input.condition,
      price: input.price,
      image_url: input.imageUrl || null,
      popular: Boolean(input.popular),
      is_active: input.isActive ?? true,
    })
    .select("id, name, category, condition, price, image_url, popular, is_active")
    .single();

  if (insertResult.error) {
    const fallbackInsert = await supabase
      .from("products")
      .insert({
        name: input.name,
        category: input.category,
        condition: input.condition,
        price: input.price,
      })
      .select("id, name, category, condition, price")
      .single();

    if (fallbackInsert.error) {
      return { product: null, error: fallbackInsert.error.message || insertResult.error.message, code: fallbackInsert.error.code || insertResult.error.code };
    }

    if (!fallbackInsert.data) {
      return { product: null, error: "Ürün kaydedilemedi." };
    }

    await supabase
      .from("products")
      .update({
        image_url: input.imageUrl || null,
        popular: Boolean(input.popular),
        is_active: input.isActive ?? true,
      })
      .eq("id", fallbackInsert.data.id);

    return {
      product: {
        id: fallbackInsert.data.id,
        name: fallbackInsert.data.name,
        category: fallbackInsert.data.category,
        condition: fallbackInsert.data.condition,
        price: Number(fallbackInsert.data.price),
        imageUrl: null,
        popular: false,
        isActive: true,
      },
    };
  }

  if (!insertResult.data) {
    return { product: null, error: "Ürün kaydedilemedi." };
  }

  return { product: mapProductRow(insertResult.data as ProductRow) };
}
