import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const DEFAULT_BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || "product-images";

const extByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const bucketMissing = (message: string) => {
  const lower = message.toLocaleLowerCase("en");
  return lower.includes("bucket") && (lower.includes("not found") || lower.includes("does not exist"));
};

async function ensureBucket(supabase: ReturnType<typeof createAdminSupabaseClient>, bucketName: string) {
  if (!supabase) {
    return false;
  }

  const buckets = await supabase.storage.listBuckets();
  if (buckets.data?.some((bucket) => bucket.name === bucketName)) {
    return true;
  }

  const createResult = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
    allowedMimeTypes: [...ALLOWED_TYPES],
  });

  return !createResult.error;
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Veritabanı bağlantısı yapılandırılmamış." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Yüklenecek görsel bulunamadı." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsiniz." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Dosya boyutu en fazla 5MB olabilir." }, { status: 400 });
  }

  const extension = extByMime[file.type] || "jpg";
  const filePath = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  let upload = await supabase.storage.from(DEFAULT_BUCKET).upload(filePath, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (upload.error && bucketMissing(upload.error.message)) {
    const created = await ensureBucket(supabase, DEFAULT_BUCKET);
    if (!created) {
      return NextResponse.json({ error: "Görsel alanı hazırlanamadı. Lütfen tekrar deneyin." }, { status: 500 });
    }

    upload = await supabase.storage.from(DEFAULT_BUCKET).upload(filePath, bytes, {
      contentType: file.type,
      upsert: false,
    });
  }

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message || "Görsel yüklenemedi." }, { status: 500 });
  }

  const publicUrlResult = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(filePath);
  const imageUrl = publicUrlResult.data.publicUrl;

  if (!imageUrl) {
    return NextResponse.json({ error: "Görsel URL oluşturulamadı." }, { status: 500 });
  }

  return NextResponse.json({ url: imageUrl });
}
