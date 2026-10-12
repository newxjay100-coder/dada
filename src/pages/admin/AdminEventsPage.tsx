import React, { useState, useEffect } from 'react';
import { EventItem, PopupItem } from '@/types/database.types';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_POPUPS } from '@/mock/mockData';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit3, Trash2, Calendar, Sparkles, Cloud, X } from 'lucide-react';
import { ImageUploadField } from '@/components/common/ImageUploadField';
import { Link } from 'react-router-dom';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [popups, setPopups] = useState<PopupItem[]>(INITIAL_POPUPS);
  const [activeTab, setActiveTab] = useState<'events' | 'popups'>('events');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=1600&auto=format&fit=crop'
  );
  const [linkUrl, setLinkUrl] = useState('/category/women');
  const [startDate, setStartDate] = useState('2026-10-06');
  const [endDate, setEndDate] = useState('2026-11-06');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenNew = () => {
    setEditingEvent(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600&auto=format&fit=crop');
    setLinkUrl('/category/women');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setShowEventModal(true);
  };

  const handleOpenEdit = (e: EventItem) => {
    setEditingEvent(e);
    setTitle(e.title);
    setSubtitle(e.subtitle || '');
    setImageUrl(e.banner_image_url);
    setLinkUrl(e.link_url || '/category/women');
    setStartDate(e.start_date || '2026-10-06');
    setEndDate(e.end_date || '2026-11-06');
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved: EventItem = {
      id: editingEvent?.id || `ev-${Date.now()}`,
      slug: editingEvent?.slug || `event-${Date.now().toString().slice(-4)}`,
      title,
      subtitle,
      banner_image_url: imageUrl,
      link_url: linkUrl,
      event_type: 'campaign',
      start_date: startDate,
      end_date: endDate,
      is_active: editingEvent ? editingEvent.is_active : true,
      display_order: editingEvent ? editingEvent.display_order : events.length + 1,
    };

    await api.saveEvent(saved);
    await loadEvents();
    setShowEventModal(false);
    showToast(
      editingEvent
        ? '기획전이 수정되어 Supabase에 실시간 반영되었습니다.'
        : '새 프로모션 기획전이 등록되어 Supabase에 실시간 업로드되었습니다.',
      'success'
    );
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (window.confirm(`정말로 '${title}' 기획전을 삭제하시겠습니까? Supabase 클라우드에서도 즉시 삭제됩니다.`)) {
      await api.deleteEvent(id);
      await loadEvents();
      showToast('기획전이 삭제되었습니다 (Supabase 동기화 완료).', 'info');
    }
  };

  const handleToggleActive = async (item: EventItem) => {
    const updated = { ...item, is_active: !item.is_active };
    await api.saveEvent(updated);
    await loadEvents();
    showToast('이벤트 노출 상태가 변경되었습니다 (Supabase 반영).', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">이벤트 및 팝업 관리 (MARKETING)</h1>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              SUPABASE LIVE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            홈 캠페인 히어로 슬라이더, 1+1 스페셜 기획전, 모달 팝업 배너 일정 및 활성화 제어 (Supabase 실시간 연동)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/supabase"
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-cyan-500/30 rounded"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? '⚡ Supabase 연동 ON' : 'Supabase 설정'}</span>
          </Link>
          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> 신규 기획전 추가
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 ${
            activeTab === 'events'
              ? 'border-b-2 border-white text-white font-bold -mb-[1px]'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          기획전 &amp; 히어로 슬라이더 ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('popups')}
          className={`pb-3 ${
            activeTab === 'popups'
              ? 'border-b-2 border-white text-white font-bold -mb-[1px]'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          레이어 팝업 배너 ({popups.length})
        </button>
      </div>

      {activeTab === 'events' ? (
        <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 w-24">배너 이미지</th>
                <th className="py-3 px-4">기획전명 / 타이틀</th>
                <th className="py-3 px-4">기간</th>
                <th className="py-3 px-4">유형</th>
                <th className="py-3 px-4 text-center">활성 상태</th>
                <th className="py-3 px-4 text-center">관리 액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                    이벤트 데이터를 불러오는 중...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                    등록된 기획전이 없습니다.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-900/50">
                    <td className="py-3 px-4">
                      <div className="w-16 h-10 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                        <img
                          src={e.banner_image_url}
                          alt={e.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{e.title}</div>
                      <div className="text-neutral-400 text-[11px] truncate max-w-md">
                        {e.subtitle}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-mono text-[11px]">
                      {e.start_date} ~ {e.end_date}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 text-[10px]">
                        {e.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(e)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          e.is_active
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {e.is_active ? '노출 중' : '숨김'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(e)}
                          className="p-1 text-neutral-400 hover:text-cyan-300 hover:bg-neutral-800 rounded"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e.id, e.title)}
                          className="p-1 text-neutral-400 hover:text-pink-400 hover:bg-neutral-800 rounded"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded text-xs text-neutral-400">
          모달 팝업 배너 {popups.length}건이 등록되어 있습니다.
        </div>
      )}

      {/* Event Create/Edit Modal with ImageUploadField */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-lg w-full space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {editingEvent ? '기획전 수정 (Supabase 동기화)' : '신규 기획전 등록 (Supabase)'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-neutral-400 mb-1">기획전명 (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2026 S/S CYBER STREET EDITORIAL"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">부제목 (Subtitle)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="예: 전 회원 대상 최대 20% 쿠폰팩 및 리뷰 포인트 2배 적립"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              {/* Image Upload Field */}
              <ImageUploadField
                value={imageUrl}
                onChange={setImageUrl}
                bucket="banners"
                label="기획전 / 히어로 슬라이더 배너 이미지"
                recommendedSize="1600 x 900 px (가로형 와이드 배너 권장)"
              />

              <div>
                <label className="block text-neutral-400 mb-1">연결 링크 URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">시작일</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">종료일</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold"
                >
                  {editingEvent ? '수정 완료 (Supabase 반영)' : '등록하기 (Supabase 업로드)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
