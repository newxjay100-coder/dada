import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle, RefreshCw, Link2, Sparkles } from 'lucide-react';
import { uploadImageFile, ImageUploadResult } from '@/services/imageUploadService';
import { useToast } from '@/context/ToastContext';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: 'products' | 'product-images' | 'banners' | 'avatars';
  label?: string;
  recommendedSize?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  bucket = 'products',
  label = '대표 이미지',
  recommendedSize = '1000 x 1000 px 이상 권장 (JPG, PNG, WebP)',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSource, setUploadSource] = useState<'supabase' | 'local' | 'url' | null>(() => {
    if (!value) return null;
    return 'supabase';
  });
  const [isUrlInputMode, setIsUrlInputMode] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const result: ImageUploadResult = await uploadImageFile(file, bucket);
      onChange(result.url);
      setUploadSource(result.source === 'supabase_storage' ? 'supabase' : 'local');
      showToast(
        result.source === 'supabase_storage'
          ? '⚡ Supabase Storage 클라우드에 성공적으로 업로드되었습니다!'
          : '이미지가 안전하게 저장되었습니다 (로컬 스토리지 연동).',
        'success'
      );
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('이미지 업로드 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onChange(customUrl.trim());
    setUploadSource('url');
    setIsUrlInputMode(false);
    showToast('이미지 URL이 적용되었습니다.', 'info');
  };

  const handleClear = () => {
    onChange('');
    setUploadSource(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
          {label} <span className="text-pink-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setIsUrlInputMode(!isUrlInputMode)}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <Link2 className="w-3 h-3" />
          {isUrlInputMode ? '파일 업로드 모드로 전환' : '외부 URL 직접 입력'}
        </button>
      </div>

      {isUrlInputMode ? (
        <form onSubmit={handleApplyUrl} className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs"
          >
            적용
          </button>
        </form>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="relative border border-neutral-700 bg-neutral-950 p-2.5 rounded-lg flex items-center gap-4">
              <div className="relative w-20 h-20 bg-neutral-900 border border-neutral-800 rounded overflow-hidden shrink-0">
                <img
                  src={value}
                  alt="업로드 미리보기"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      uploadSource === 'supabase'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : uploadSource === 'local'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    <CheckCircle className="w-2.5 h-2.5" />
                    {uploadSource === 'supabase'
                      ? '⚡ Supabase Storage'
                      : uploadSource === 'local'
                      ? '📦 로컬 DataURL'
                      : '🔗 웹 이미지 URL'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono truncate max-w-sm">
                  {value.startsWith('data:') ? 'Base64 Encoded Image Data' : value}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isUploading ? 'animate-spin' : ''}`} />
                    다른 이미지로 교체
                  </button>
                  <span className="text-neutral-600">|</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[11px] font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> 삭제
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-neutral-700 hover:border-cyan-500/80 bg-neutral-950/80 hover:bg-neutral-900/60 p-6 rounded-lg text-center cursor-pointer transition-all group ${
                isUploading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  {isUploading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {isUploading ? '이미지 업로드 처리 중...' : '클릭하여 이미지 파일 선택 (또는 드래그 & 드롭)'}
                  </span>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {recommendedSize}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 pt-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Supabase Storage 및 데이터베이스 실시간 연동</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
