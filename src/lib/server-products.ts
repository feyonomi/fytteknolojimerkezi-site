import { ProductItem } from "@/types";
import { createAdminSupabaseClient } from "@/lib/supabase";

type ProductRow = {
  id: string;
  name: string;
  category: ProductItem["category"];
  condition: ProductItem["condition"];
  price: number | string;
  image_url?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  popular?: boolean | null;
  is_active?: boolean | null;
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
  imageUrl: item.image_url ?? item.image ?? item.imageUrl ?? null,
  popular: Boolean(item.popular ?? false),
  isActive: item.is_active ?? true,
});

const PRODUCT_SELECT_VARIANTS = [
  "id, name, category, condition, price, image_url, popular, is_active",
  "id, name, category, condition, price, image, popular, is_active",
  "id, name, category, condition, price, \"imageUrl\", popular, is_active",
  "id, name, category, condition, price, image_url",
  "id, name, category, condition, price, image",
  "id, name, category, condition, price, \"imageUrl\"",
  "id, name, category, condition, price, popular, is_active",
  "id, name, category, condition, price",
] as const;

async function fetchProductRows(
  supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>,
  activeOnly: boolean
): Promise<ProductRow[]> {
  for (const variant of PRODUCT_SELECT_VARIANTS) {
    let query: any = supabase.from("products").select(variant as string);
    if (activeOnly && variant.includes("is_active")) {
      query = query.eq("is_active", true);
    }

    const result: any = await query.order("created_at", { ascending: false });
    if (!result.error && Array.isArray(result.data)) {
      return result.data as ProductRow[];
    }
  }

  return [];
}

async function applyOptionalProductFields(
  supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>,
  id: string,
  input: CreateProductInput
) {
  const imageValue = input.imageUrl ?? null;
  const popular = Boolean(input.popular);
  const isActive = input.isActive ?? true;

  const payloads: Array<Record<string, unknown>> = [
    { image_url: imageValue, popular, is_active: isActive },
    { image: imageValue, popular, is_active: isActive },
    { imageUrl: imageValue, popular, is_active: isActive },
    { image_url: imageValue, popular },
    { image: imageValue, popular },
    { imageUrl: imageValue, popular },
    { image_url: imageValue, is_active: isActive },
    { image: imageValue, is_active: isActive },
    { imageUrl: imageValue, is_active: isActive },
    { image_url: imageValue },
    { image: imageValue },
    { imageUrl: imageValue },
    { popular, is_active: isActive },
    { popular },
    { is_active: isActive },
  ];

  for (const payload of payloads) {
    const result = await supabase.from("products").update(payload).eq("id", id);
    if (!result.error) {
      return true;
    }
  }

  return false;
}

export async function getProducts(): Promise<ProductItem[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const rows = await fetchProductRows(supabase, true);
  if (rows.length === 0) {
    return [];
  }

  return rows.map((item) => {
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

export async function getAdminProducts(): Promise<AdminProductItem[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const rows = await fetchProductRows(supabase, false);
  if (rows.length === 0) {
    return [];
  }

  return rows.map(mapProductRow);
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

    await applyOptionalProductFields(supabase, fallbackInsert.data.id, input);

    return {
      product: {
        id: fallbackInsert.data.id,
        name: fallbackInsert.data.name,
        category: fallbackInsert.data.category,
        condition: fallbackInsert.data.condition,
        price: Number(fallbackInsert.data.price),
        imageUrl: input.imageUrl || null,
        popular: Boolean(input.popular),
        isActive: input.isActive ?? true,
      },
    };
  }

  if (!insertResult.data) {
    return { product: null, error: "Ürün kaydedilemedi." };
  }

  return { product: mapProductRow(insertResult.data as ProductRow) };
}

export async function updateProduct(id: string, input: CreateProductInput) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { product: null, error: "Veritabanı bağlantısı bulunamadı." };
  }

  const updateResult = await supabase
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      condition: input.condition,
      price: input.price,
      image_url: input.imageUrl || null,
      popular: Boolean(input.popular),
      is_active: input.isActive ?? true,
    })
    .eq("id", id)
    .select("id, name, category, condition, price, image_url, popular, is_active")
    .single();

  if (updateResult.error) {
    const fallbackUpdate = await supabase
      .from("products")
      .update({
        name: input.name,
        category: input.category,
        condition: input.condition,
        price: input.price,
      })
      .eq("id", id)
      .select("id, name, category, condition, price")
      .single();

    if (fallbackUpdate.error) {
      return { product: null, error: fallbackUpdate.error.message || updateResult.error.message, code: fallbackUpdate.error.code || updateResult.error.code };
    }

    if (!fallbackUpdate.data) {
      return { product: null, error: "Ürün güncellenemedi." };
    }

    await applyOptionalProductFields(supabase, id, input);

    return {
      product: {
        id: fallbackUpdate.data.id,
        name: fallbackUpdate.data.name,
        category: fallbackUpdate.data.category,
        condition: fallbackUpdate.data.condition,
        price: Number(fallbackUpdate.data.price),
        imageUrl: input.imageUrl || null,
        popular: Boolean(input.popular),
        isActive: input.isActive ?? true,
      },
    };
  }

  if (!updateResult.data) {
    return { product: null, error: "Ürün güncellenemedi." };
  }

  return { product: mapProductRow(updateResult.data as ProductRow) };
}

export async function deleteProduct(id: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı bağlantısı bulunamadı." };
  }

  const removeResult = await supabase.from("products").delete().eq("id", id);

  if (removeResult.error) {
    return { success: false, error: removeResult.error.message };
  }

  return { success: true };
}
