import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ImageUploadResult {
  url: string;
  source: 'supabase_storage' | 'base64_data_url';
  fileName: string;
  fileSizeBytes: number;
}

/**
 * Resizes / compresses image to a reasonable dataURL if needed
 */
async function fileToDataUrl(file: File, maxWidth = 1400, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
        resolve(dataUrl);
      };
      image.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      image.src = readerEvent.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export type StorageBucketName = 'products' | 'product-images' | 'banners' | 'avatars';

/**
 * Uploads an image file to Supabase Storage, with automatic seamless fallback to DataURL
 */
export async function uploadImageFile(
  file: File,
  bucket: StorageBucketName = 'products'
): Promise<ImageUploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${Date.now()}-${sanitizedName}`;

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured) {
    // Try primary bucket first, then alternative if it fails
    const bucketsToTry: StorageBucketName[] =
      bucket === 'products'
        ? ['products', 'product-images']
        : bucket === 'product-images'
        ? ['product-images', 'products']
        : [bucket];

    for (const b of bucketsToTry) {
      try {
        const { data, error } = await supabase.storage
          .from(b)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data?.path) {
          const { data: pubData } = supabase.storage.from(b).getPublicUrl(data.path);
          if (pubData?.publicUrl) {
            return {
              url: pubData.publicUrl,
              source: 'supabase_storage',
              fileName: file.name,
              fileSizeBytes: file.size,
            };
          }
        }
      } catch (err) {
        console.warn(`Supabase storage upload attempt to bucket '${b}' failed:`, err);
      }
    }
  }

  // 2. Seamless Local Fallback to optimized DataURL
  const dataUrl = await fileToDataUrl(file);
  return {
    url: dataUrl,
    source: 'base64_data_url',
    fileName: file.name,
    fileSizeBytes: file.size,
  };
}

/**
 * Uploads a local/static image file (by URL/path) into Supabase Storage bucket
 */
export async function uploadStaticImageToStorage(
  imageUrl: string,
  targetFileName: string,
  bucket: StorageBucketName = 'products'
): Promise<ImageUploadResult> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const file = new File([blob], targetFileName, { type: blob.type || 'image/jpeg' });
    return await uploadImageFile(file, bucket);
  } catch (err) {
    console.warn(`Failed to fetch static image ${imageUrl} for upload:`, err);
    return {
      url: imageUrl,
      source: 'base64_data_url',
      fileName: targetFileName,
      fileSizeBytes: 0,
    };
  }
}

