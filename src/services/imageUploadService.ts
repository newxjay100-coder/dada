import { supabase, isSupabaseReady } from '@/lib/supabase';
import { MediaAsset } from '@/types/database.types';

export interface ImageUploadResult {
  url: string;
  source: 'supabase_storage' | 'base64_data_url';
  fileName: string;
  fileSizeBytes: number;
  mediaAssetId?: string;
}

/**
 * Resizes / compresses image to an optimized dataURL
 */
async function fileToDataUrl(file: File, maxWidth = 1100, quality = 0.84): Promise<string> {
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

export type StorageBucketName = 'products' | 'product-images' | 'banners' | 'avatars' | 'editorial';

/**
 * Helper to register an uploaded or updated image asset into Supabase Cloud Database
 */
export async function registerMediaAssetInSupabase(asset: MediaAsset): Promise<void> {
  if (!isSupabaseReady()) return;

  try {
    // 1. Try dedicated media_assets table if created
    await supabase.from('media_assets').upsert(asset);
  } catch {
    // ignore if table not created yet
  }

  try {
    // 2. Always persist into live Supabase notices table (with media_ prefix) for guaranteed cloud storage
    const cloudId = asset.id.startsWith('media_') ? asset.id : `media_${asset.id}`;
    await supabase.from('notices').upsert({
      id: cloudId,
      title: `[MEDIA:${asset.bucket}] ${asset.title}`,
      content: JSON.stringify({ ...asset, id: cloudId }),
      is_pinned: false,
      view_count: asset.file_size || 0,
      created_at: asset.created_at || new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Supabase cloud media asset sync warning:', e);
  }
}

/**
 * Uploads an image file to Supabase Storage & Cloud DB
 */
export async function uploadImageFile(
  file: File,
  bucket: StorageBucketName = 'products',
  metadata?: { title?: string; linkedType?: MediaAsset['linked_type']; linkedId?: string }
): Promise<ImageUploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${Date.now()}-${sanitizedName}`;
  const normalizedBucket: MediaAsset['bucket'] =
    bucket === 'product-images' ? 'products' : bucket;
  const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  // 1. Try Supabase Storage Bucket first
  if (isSupabaseReady()) {
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
            const asset: MediaAsset = {
              id: mediaId,
              title: metadata?.title || file.name,
              file_name: sanitizedName,
              url: pubData.publicUrl,
              bucket: normalizedBucket,
              linked_type: metadata?.linkedType || 'general',
              linked_id: metadata?.linkedId,
              file_size: file.size,
              storage_source: 'supabase_storage',
              created_at: new Date().toISOString(),
            };
            await registerMediaAssetInSupabase(asset);

            return {
              url: pubData.publicUrl,
              source: 'supabase_storage',
              fileName: file.name,
              fileSizeBytes: file.size,
              mediaAssetId: mediaId,
            };
          }
        }
      } catch (err) {
        console.warn(`Supabase storage bucket '${b}' attempt fallback:`, err);
      }
    }
  }

  // 2. Optimize image and store directly in Supabase Cloud Database
  const dataUrl = await fileToDataUrl(file);

  if (isSupabaseReady()) {
    const asset: MediaAsset = {
      id: mediaId,
      title: metadata?.title || file.name,
      file_name: sanitizedName,
      url: dataUrl,
      bucket: normalizedBucket,
      linked_type: metadata?.linkedType || 'general',
      linked_id: metadata?.linkedId,
      file_size: file.size,
      storage_source: 'supabase_db',
      created_at: new Date().toISOString(),
    };
    await registerMediaAssetInSupabase(asset);

    return {
      url: dataUrl,
      source: 'supabase_storage',
      fileName: file.name,
      fileSizeBytes: file.size,
      mediaAssetId: mediaId,
    };
  }

  return {
    url: dataUrl,
    source: 'base64_data_url',
    fileName: file.name,
    fileSizeBytes: file.size,
  };
}

/**
 * Uploads a local/static image file (by URL/path) into Supabase Storage & Cloud DB
 */
export async function uploadStaticImageToStorage(
  imageUrl: string,
  targetFileName: string,
  bucket: StorageBucketName = 'products',
  metadata?: { title?: string; linkedType?: MediaAsset['linked_type']; linkedId?: string }
): Promise<ImageUploadResult> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const file = new File([blob], targetFileName, { type: blob.type || 'image/jpeg' });
    return await uploadImageFile(file, bucket, metadata);
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
