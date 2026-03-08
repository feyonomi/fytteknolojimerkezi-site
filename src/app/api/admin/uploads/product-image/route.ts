import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);
const DEFAULT_BUCKET = process.env.SUPABASE_PRODUCT_BUCKET || "product-images";

const extByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
};

const mimeByExt: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
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
  const existing = buckets.data?.find((bucket) => bucket.name === bucketName);
  if (existing) {
    if (!existing.public) {
      const updateResult = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: [...ALLOWED_TYPES],
      });
      return !updateResult.error;
    }

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

  const fallbackMime = (() => {
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
    return ext ? mimeByExt[ext] : undefined;
  })();

  const normalizedType = file.type.toLowerCase();
  const mimeType = ALLOWED_TYPES.has(normalizedType) ? normalizedType : fallbackMime || "";

  if (!ALLOWED_TYPES.has(mimeType)) {
    return NextResponse.json({ error: "Sadece JPG, PNG, WEBP, GIF, HEIC veya HEIF yükleyebilirsiniz." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Dosya boyutu en fazla 10MB olabilir." }, { status: 400 });
  }

  const bucketReady = await ensureBucket(supabase, DEFAULT_BUCKET);
  if (!bucketReady) {
    return NextResponse.json({ error: "Görsel alanı hazırlanamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }

  const extension = extByMime[mimeType] || "jpg";
  const filePath = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  let upload = await supabase.storage.from(DEFAULT_BUCKET).upload(filePath, bytes, {
    contentType: mimeType,
    upsert: false,
  });

  if (upload.error && bucketMissing(upload.error.message)) {
    const created = await ensureBucket(supabase, DEFAULT_BUCKET);
    if (!created) {
      return NextResponse.json({ error: "Görsel alanı hazırlanamadı. Lütfen tekrar deneyin." }, { status: 500 });
    }

    upload = await supabase.storage.from(DEFAULT_BUCKET).upload(filePath, bytes, {
      contentType: mimeType,
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
