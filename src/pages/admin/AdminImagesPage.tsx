import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Search,
  Cloud,
  Sparkles,
  Link2,
  ExternalLink,
  CheckCircle2,
  Database,
  FolderOpen,
} from 'lucide-react';
import { api } from '@/services/api';
import { uploadImageFile, StorageBucketName } from '@/services/imageUploadService';
import { MediaAsset } from '@/types/database.types';
import { useToast } from '@/context/ToastContext';

export const AdminImagesPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<'all' | 'products' | 'banners' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New upload state
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadBucket, setUploadBucket] = useState<StorageBucketName>('products');
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement | null>(null);

  // Replace image state
  const [replacingAssetId, setReplacingAssetId] = useState<string | null>(null);
  const [editingUrlAssetId, setEditingUrlAssetId] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const activeReplaceAssetRef = useRef<MediaAsset | null>(null);

  const { showToast } = useToast();

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const list = await api.getMediaAssets();
      setAssets(list);
    } catch (e) {
      console.error('Failed to load media assets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleSyncAllToSupabase = async () => {
    setIsSyncingAll(true);
    try {
      const res = await api.syncAllImagesToSupabase();
      if (res.success) {
        showToast(
          `⚡ 총 ${res.syncedCount}개의 상품 및 배너 이미지가 Supabase 클라우드에 일괄 동기화되었습니다!`,
          'success'
        );
        await loadAssets();
      } else {
        showToast(`동기화 오류: ${res.error}`, 'error');
      }
    } catch (e: any) {
      showToast(`동기화 실패: ${e.message}`, 'error');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleNewFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일(JPG, PNG, WebP 등)만 업로드 가능합니다.', 'error');
      return;
    }

    setIsUploadingNew(true);
    try {
      const title = uploadTitle.trim() || file.name;
      const result = await uploadImageFile(file, uploadBucket, {
        title,
        linkedType: 'general',
      });

      showToast(
        `⚡ '${title}' 이미지가 Supabase 클라우드에 성공적으로 업로드되었습니다!`,
        'success'
      );
      setUploadTitle('');
      setIsUploadPanelOpen(false);
      await loadAssets();
      if (result.url) {
        navigator.clipboard?.writeText(result.url).catch(() => {});
      }
    } catch (err: any) {
      showToast(`업로드 실패: ${err.message}`, 'error');
    } finally {
      setIsUploadingNew(false);
      if (newFileInputRef.current) newFileInputRef.current.value = '';
    }
  };

  const triggerReplaceFile = (asset: MediaAsset) => {
    activeReplaceAssetRef.current = asset;
    replaceFileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetAsset = activeReplaceAssetRef.current;
    if (!file || !targetAsset) return;

    setReplacingAssetId(targetAsset.id);
    try {
      const res = await uploadImageFile(file, targetAsset.bucket, {
        title: targetAsset.title,
        linkedType: targetAsset.linked_type,
        linkedId: targetAsset.linked_id,
      });

      const updatedAsset: MediaAsset = {
        ...targetAsset,
        url: res.url,
        file_name: res.fileName,
        file_size: res.fileSizeBytes,
        storage_source: 'supabase_storage',
        created_at: new Date().toISOString(),
      };

      await api.saveMediaAsset(updatedAsset);
      showToast(
        `⚡ '${targetAsset.title}' 이미지가 교체되어 Supabase 클라우드 및 사이트에 즉시 반영되었습니다!`,
        'success'
      );
      await loadAssets();
    } catch (err: any) {
      showToast(`이미지 교체 실패: ${err.message}`, 'error');
    } finally {
      setReplacingAssetId(null);
      activeReplaceAssetRef.current = null;
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
    }
  };

  const handleSaveCustomUrl = async (asset: MediaAsset) => {
    if (!customUrlInput.trim()) return;
    setReplacingAssetId(asset.id);
    try {
      const updatedAsset: MediaAsset = {
        ...asset,
        url: customUrlInput.trim(),
        created_at: new Date().toISOString(),
      };
      await api.saveMediaAsset(updatedAsset);
      showToast(`⚡ '${asset.title}' 이미지 URL이 Supabase에 업데이트되었습니다!`, 'success');
      setEditingUrlAssetId(null);
      setCustomUrlInput('');
      await loadAssets();
    } catch (err: any) {
      showToast(`URL 변경 실패: ${err.message}`, 'error');
    } finally {
      setReplacingAssetId(null);
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('이미지 주소(URL/Data)가 클립보드에 복사되었습니다.', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (!window.confirm(`'${asset.title}' 이미지를 Supabase 미디어 라이브러리에서 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await api.deleteMediaAsset(asset.id);
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      showToast('이미지가 삭제되었습니다.', 'info');
    } catch (err: any) {
      showToast(`삭제 실패: ${err.message}`, 'error');
    }
  };

  const storageSql = `-- ==========================================
-- Supabase Storage 버킷 & 미디어 테이블 생성 SQL
-- Supabase Dashboard > SQL Editor에 붙여넣고 Run 클릭
-- ==========================================

-- 1. Storage 버킷 생성 (products, banners, avatars)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('banners', 'banners', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage 누구나 조회 및 업로드 가능하도록 RLS 정책 허용
DROP POLICY IF EXISTS "Public Access Objects" ON storage.objects;
CREATE POLICY "Public Access Objects"
ON storage.objects FOR ALL
USING ( bucket_id IN ('products', 'banners', 'avatars') )
WITH CHECK ( bucket_id IN ('products', 'banners', 'avatars') );

-- 3. 미디어 통합 관리 테이블 생성
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  url TEXT NOT NULL,
  bucket TEXT DEFAULT 'products',
  linked_type TEXT DEFAULT 'general',
  linked_id TEXT,
  file_size INT DEFAULT 0,
  storage_source TEXT DEFAULT 'supabase_storage',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on media_assets" ON public.media_assets;
CREATE POLICY "Allow all on media_assets" ON public.media_assets FOR ALL USING (true) WITH CHECK (true);`;

  const handleCopyStorageSql = () => {
    navigator.clipboard.writeText(storageSql);
    setCopiedSql(true);
    showToast('Supabase Storage 버킷 생성 SQL이 복사되었습니다!', 'success');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredAssets = assets.filter((a) => {
    if (selectedBucket === 'products' && a.bucket !== 'products') return false;
    if (selectedBucket === 'banners' && a.bucket !== 'banners') return false;
    if (selectedBucket === 'custom' && (a.linked_type === 'product' || a.linked_type === 'event')) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.file_name.toLowerCase().includes(q) ||
        (a.linked_id && a.linked_id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Replacing Existing Image */}
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleReplaceFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SUPABASE IMAGE CLOUD: LIVE
            </span>
            <span className="text-xs font-mono text-cyan-400">
              총 {assets.length}개 미디어 에셋 연동 중
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1.5 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-cyan-400" />
            <span>Supabase 이미지 &amp; 미디어 통합 관리</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            상품 대표 이미지, 기획전 배너, 신규 이미지를 업로드하거나 교체하면 Supabase 클라우드와 쇼핑몰 화면에 실시간 반영됩니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsUploadPanelOpen(!isUploadPanelOpen)}
            className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>+ 새 이미지 Supabase 업로드</span>
          </button>

          <button
            onClick={handleSyncAllToSupabase}
            disabled={isSyncingAll}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Cloud className={`w-4 h-4 ${isSyncingAll ? 'animate-bounce' : ''}`} />
            <span>
              {isSyncingAll
                ? 'Supabase 클라우드 동기화 중...'
                : '⚡ 전체 이미지 Supabase 일괄 저장'}
            </span>
          </button>

          <a
            href="https://supabase.com/dashboard/project/gseueojxksbhbgvisshq/storage/buckets"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-lg border border-neutral-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Supabase Storage 콘솔</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* New Image Upload Drawer */}
      {isUploadPanelOpen && (
        <div className="p-6 bg-gradient-to-r from-[#0f172a] via-[#13132b] to-[#1e1028] border border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)] space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>신규 이미지 Supabase 클라우드 직접 업로드</span>
            </h3>
            <button
              onClick={() => setIsUploadPanelOpen(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                이미지 제목 / 설명
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="예: 2026 F/W 네온 카고 팬츠 화보"
                className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                저장할 버킷 (카테고리)
              </label>
              <select
                value={uploadBucket}
                onChange={(e) => setUploadBucket(e.target.value as StorageBucketName)}
                className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-400"
              >
                <option value="products">products (상품 이미지)</option>
                <option value="banners">banners (메인/기획전 배너)</option>
                <option value="avatars">avatars (회원 프로필)</option>
                <option value="editorial">editorial (매거진/화보)</option>
              </select>
            </div>

            <div className="flex items-end">
              <input
                ref={newFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleNewFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => newFileInputRef.current?.click()}
                disabled={isUploadingNew}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploadingNew ? 'Supabase 업로드 중...' : '내 PC에서 이미지 파일 선택 및 업로드'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `전체 미디어 (${assets.length})` },
            {
              id: 'products',
              label: `상품 이미지 (${assets.filter((a) => a.bucket === 'products').length})`,
            },
            {
              id: 'banners',
              label: `기획전/배너 (${assets.filter((a) => a.bucket === 'banners').length})`,
            },
            {
              id: 'custom',
              label: `신규 업로드 (${
                assets.filter((a) => a.linked_type !== 'product' && a.linked_type !== 'event').length
              })`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBucket(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedBucket === tab.id
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="상품명, 배너명, 파일명 검색..."
            className="w-full bg-neutral-900 border border-neutral-700 pl-9 pr-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-sm">
          Supabase 클라우드에서 이미지 목록을 불러오는 중...
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="p-16 text-center bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
          <FolderOpen className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-sm text-neutral-400">해당 조건의 이미지가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredAssets.map((asset) => {
            const isReplacing = replacingAssetId === asset.id;
            const isEditingUrl = editingUrlAssetId === asset.id;

            return (
              <div
                key={asset.id}
                className="bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 rounded-xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
              >
                <div>
                  {/* Image Preview Box */}
                  <div className="relative aspect-square bg-neutral-900 overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase backdrop-blur-md ${
                          asset.bucket === 'products'
                            ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                            : asset.bucket === 'banners'
                            ? 'bg-pink-950/90 text-pink-300 border border-pink-500/40'
                            : 'bg-purple-950/90 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {asset.bucket}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 backdrop-blur-md">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Supabase 연동
                      </span>
                    </div>

                    {/* Hover Quick Replace Overlay */}
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <button
                        type="button"
                        onClick={() => triggerReplaceFile(asset)}
                        disabled={isReplacing}
                        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReplacing ? 'animate-spin' : ''}`} />
                        <span>{isReplacing ? '업로드 중...' : '새 이미지 파일로 교체'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingUrlAssetId(isEditingUrl ? null : asset.id);
                          setCustomUrlInput(asset.url.startsWith('data:') ? '' : asset.url);
                        }}
                        className="w-full py-2 bg-neutral-900/90 hover:bg-neutral-800 text-white font-mono text-[11px] rounded-lg border border-neutral-600 flex items-center justify-center gap-1.5"
                      >
                        <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>이미지 URL 직접 수정</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Info */}
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-xs font-bold text-white truncate" title={asset.title}>
                      {asset.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span className="truncate max-w-[140px]">{asset.file_name}</span>
                      {asset.linked_id && (
                        <span className="text-cyan-400/90">ID: {asset.linked_id}</span>
                      )}
                    </div>

                    {/* Direct URL Edit Box */}
                    {isEditingUrl && (
                      <div className="pt-2 space-y-1.5">
                        <input
                          type="url"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          placeholder="https://... 새 이미지 URL 입력"
                          className="w-full bg-neutral-900 border border-cyan-500/50 p-1.5 text-[11px] text-white rounded font-mono focus:outline-none"
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveCustomUrl(asset)}
                            className="flex-1 py-1 bg-cyan-500 text-black font-bold text-[11px] rounded"
                          >
                            Supabase 저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUrlAssetId(null)}
                            className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-[11px] rounded"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-3.5 py-2.5 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => triggerReplaceFile(asset)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                  >
                    <Upload className="w-3 h-3" />
                    <span>파일 교체</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset.id, asset.url)}
                      className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                      title="URL 복사"
                    >
                      {copiedId === asset.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>복사</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(asset)}
                      className="text-neutral-500 hover:text-pink-400 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Storage Bucket SQL Helper */}
      <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white">
              Supabase Storage 전용 버킷(`products`, `banners`, `avatars`) &amp; `media_assets` 테이블 생성 SQL
            </h3>
          </div>
          <button
            onClick={handleCopyStorageSql}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-mono rounded border border-neutral-700 flex items-center gap-1.5"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? '복사 완료!' : 'Storage SQL 복사'}</span>
          </button>
        </div>
        <p className="text-[11px] text-neutral-400">
          현재 모든 이미지는 별도 설정 없이도 Supabase 클라우드 DB에 즉시 저장 및 연동되고 있습니다. 만약 Supabase 대시보드의 <strong>Storage &gt; Buckets</strong> 메뉴에서도 파일 폴더 형태로 직접 열람하시려면 위 SQL을 복사해 Supabase SQL Editor에서 1회 실행해 주세요.
        </p>
      </div>
    </div>
  );
};
