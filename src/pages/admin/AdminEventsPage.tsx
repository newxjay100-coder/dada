import React, { useState } from 'react';
import { EventItem, PopupItem } from '@/types/database.types';
import { INITIAL_EVENTS, INITIAL_POPUPS } from '@/mock/mockData';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit3, Trash2, Calendar, Sparkles } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [popups, setPopups] = useState<PopupItem[]>(INITIAL_POPUPS);
  const [activeTab, setActiveTab] = useState<'events' | 'popups'>('events');
  const [showEventModal, setShowEventModal] = useState(false);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=1600&auto=format&fit=crop'
  );
  const [linkUrl, setLinkUrl] = useState('/category/women');
  const [startDate, setStartDate] = useState('2026-10-06');
  const [endDate, setEndDate] = useState('2026-11-06');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEv: EventItem = {
      id: `ev-${Date.now()}`,
      slug: `event-${Date.now().toString().slice(-4)}`,
      title,
      subtitle,
      banner_image_url: imageUrl,
      link_url: linkUrl,
      event_type: 'campaign',
      start_date: startDate,
      end_date: endDate,
      is_active: true,
      display_order: events.length + 1,
    };
    setEvents([...events, newEv]);
    setShowEventModal(false);
    showToast('새 프로모션 기획전이 등록되었습니다.', 'success');
  };

  const handleToggleActive = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_active: !e.is_active } : e))
    );
    showToast('이벤트 노출 상태가 변경되었습니다.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">이벤트 및 팝업 관리 (MARKETING)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            홈 캠페인 히어로 슬라이더, 1+1 스페셜 기획전, 모달 팝업 배너 일정 및 활성화 제어
          </p>
        </div>
        <button
          onClick={() => setShowEventModal(true)}
          className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> 신규 기획전 추가
        </button>
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
          기획전 & 히어로 슬라이더 ({events.length})
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
                <th className="py-3 px-4 w-20">배너</th>
                <th className="py-3 px-4">기획전명 / 타이틀</th>
                <th className="py-3 px-4">기간</th>
                <th className="py-3 px-4">유형</th>
                <th className="py-3 px-4 text-center">활성 상태</th>
                <th className="py-3 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4">
                    <div className="w-16 h-10 bg-neutral-800 overflow-hidden">
                      <img src={ev.banner_image_url} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-bold text-white block">{ev.title}</span>
                    <span className="text-[11px] text-neutral-400">{ev.subtitle}</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-neutral-300">
                    {ev.start_date} ~ {ev.end_date}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-neutral-400 uppercase">
                    {ev.event_type}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        ev.is_active
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {ev.is_active ? '노출중' : '비활성'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(ev.id)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium"
                    >
                      {ev.is_active ? '숨기기' : '노출하기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 w-20">팝업 이미지</th>
                <th className="py-3 px-4">팝업명</th>
                <th className="py-3 px-4">링크 URL</th>
                <th className="py-3 px-4 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {popups.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4">
                    <div className="w-12 h-14 bg-neutral-800 overflow-hidden">
                      <img src={p.desktop_image_url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{p.title}</td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{p.link_url}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                      활성 작동중
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white">신규 기획전 등록</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">기획전명 (Title)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">부제목 (Subtitle)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">배너 이미지 URL</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono text-[11px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
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
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#721b29] text-white font-bold">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
