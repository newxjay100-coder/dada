import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Clipboard,
} from 'lucide-react';
import {
  getSupabaseConnectionInfo,
  updateSupabaseConfig,
  testSupabaseConnection,
  isSupabaseReady,
} from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const { showToast } = useToast();
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    tables?: { [name: string]: boolean };
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const info = getSupabaseConnectionInfo();
      setUrl(info.url);
      setAnonKey(info.fullAnonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setAnonKey(text.trim());
        showToast('클립보드에서 키를 붙여넣었습니다.', 'info');
      }
    } catch {
      showToast('클립보드 읽기 권한이 없습니다. 직접 붙여넣어 주세요.', 'error');
    }
  };

  const handleTest = async () => {
    if (!anonKey.trim()) {
      showToast('Supabase Anon Key를 먼저 입력해주세요.', 'error');
      return;
    }
    setIsTesting(true);
    try {
      // Temporarily update client to test
      updateSupabaseConfig(url, anonKey);
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.ok) {
        showToast('Supabase 클라우드 연결 성공!', 'success');
      } else {
        showToast(`연결 실패: ${res.message}`, 'error');
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || '연결 오류' });
      showToast('연결 테스트 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonKey.trim()) {
      showToast('Supabase Anon Public Key를 입력해주세요.', 'error');
      return;
    }

    const ok = updateSupabaseConfig(url, anonKey);
    if (ok) {
      showToast('Supabase 연결 설정이 실시간으로 저장되었습니다! (.env 자동 반영)', 'success');
      if (onConfigSaved) onConfigSaved();
      onClose();
    } else {
      showToast('설정 저장에 실패했습니다.', 'error');
    }
  };

  const isConfigured = isSupabaseReady();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="relative w-full max-w-xl bg-[#0e0e1b] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131326] border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Supabase 클라우드 데이터베이스 연동 설정
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Indicator */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isConfigured
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs">
              {isConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <p className="font-bold">
                  {isConfigured
                    ? 'CORE: LIVE (Supabase 클라우드 실시간 연결 중)'
                    : 'KEY MISSING (Supabase Anon Key 등록 대기)'}
                </p>
                <p className="text-[11px] text-neutral-300 mt-0.5 font-sans">
                  {isConfigured
                    ? '회원가입, 프로필, 장바구니, 주문, 세금명세서 등이 Supabase 클라우드에 실시간 저장됩니다.'
                    : 'Anon Key를 등록하시면 Supabase Authentication 및 각 테이블에 데이터가 영구 저장됩니다.'}
                </p>
              </div>
            </div>
            <a
              href="https://supabase.com/dashboard/project/gseueojxksbhbgvisshq/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-300 text-[11px] rounded transition-colors shrink-0"
            >
              <span>키 복사 콘솔</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Project URL */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                SUPABASE PROJECT URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://gseueojxksbhbgvisshq.supabase.co"
                className="w-full bg-[#15152a] border border-cyan-500/30 p-2.5 text-xs text-white rounded focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            {/* Project Anon Key */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SUPABASE ANON PUBLIC KEY (API Key)</span>
                </label>
                <button
                  type="button"
                  onClick={handlePasteKey}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>붙여넣기</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#15152a] border border-cyan-500/30 p-2.5 text-xs text-white rounded font-mono focus:outline-none focus:border-cyan-400"
                required
              />
              <p className="text-[11px] text-neutral-400 mt-1 font-sans">
                Supabase Dashboard &gt; <strong>Project Settings &gt; API</strong> 에서{' '}
                <span className="text-pink-400 font-mono">anon public</span> 키를 복사하여 붙여넣으세요.
              </p>
            </div>

            {/* Test Connection Result Box */}
            {testResult && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  testResult.ok
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-500/40 text-red-300'
                }`}
              >
                <p className="font-bold">{testResult.message}</p>
                {testResult.tables && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-white/10 text-[10px]">
                    {Object.entries(testResult.tables).map(([table, exists]) => (
                      <span
                        key={table}
                        className={`inline-flex items-center gap-1 ${
                          exists ? 'text-emerald-400' : 'text-neutral-500'
                        }`}
                      >
                        {exists ? '✓' : '✗'} {table}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b1b36] hover:bg-[#25254a] border border-cyan-500/40 text-cyan-300 rounded text-xs font-bold transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? '연결 테스트 중...' : '연결 테스트'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs font-bold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black rounded text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>설정 저장 및 즉시 연동</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
