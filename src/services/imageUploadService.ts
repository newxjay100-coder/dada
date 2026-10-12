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

/**
 * Uploads an image file to Supabase Storage, with automatic seamless fallback to DataURL
 */
export async function uploadImageFile(
  file: File,
  bucket: 'product-images' | 'banners' | 'avatars' = 'product-images'
): Promise<ImageUploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${Date.now()}-${sanitizedName}`;

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        if (pubData?.publicUrl) {
          return {
            url: pubData.publicUrl,
            source: 'supabase_storage',
            fileName: file.name,
            fileSizeBytes: file.size,
          };
        }
      } else {
        console.warn('Supabase storage upload returned error, falling back to DataURL:', error);
      }
    } catch (err) {
      console.warn('Supabase storage upload exception, falling back to DataURL:', err);
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
