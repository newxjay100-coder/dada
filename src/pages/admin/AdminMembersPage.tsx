import React, { useState } from 'react';
import { Profile, MemberGradeCode, UserStatus } from '@/types/database.types';
import { MockProfileStore } from '@/mock/mockStorage';
import { useToast } from '@/context/ToastContext';
import { Search, Shield, Ban, CheckCircle, Coins, Tag, Edit3 } from 'lucide-react';

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Profile[]>(() => MockProfileStore.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointDelta, setPointDelta] = useState(1000);
  const [pointReason, setPointReason] = useState('우수 고객 감사 적립');
  const { showToast } = useToast();

  const handleToggleBlock = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const nextStatus: UserStatus = m.status === 'blocked' ? 'active' : 'blocked';
          const updated = { ...m, status: nextStatus };
          MockProfileStore.updateProfile(updated);
          return updated;
        }
        return m;
      })
    );
    showToast('회원 상태가 변경되었습니다.', 'info');
  };

  const handleChangeGrade = (memberId: string, newGrade: MemberGradeCode) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const updated = { ...m, member_grade: newGrade };
          MockProfileStore.updateProfile(updated);
          return updated;
        }
        return m;
      })
    );
    showToast('회원 등급이 성공적으로 변경되었습니다.', 'success');
  };

  const handleAdjustPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === selectedMember.id) {
          const updated = { ...m, points_balance: m.points_balance + pointDelta };
          MockProfileStore.updateProfile(updated);
          return updated;
        }
        return m;
      })
    );
    setShowPointModal(false);
    showToast(`${selectedMember.name}님에게 ${pointDelta > 0 ? '+' : ''}${pointDelta}P가 지급/조정되었습니다.`, 'success');
  };

  const filtered = members.filter((m) => {
    if (gradeFilter !== 'all' && m.member_grade !== gradeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = m.login_id?.toLowerCase().includes(q);
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchPhone = m.phone?.includes(q);
      if (!matchId && !matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">회원 관리 (MEMBER DIRECTORY)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            등록된 고객 계정 조회, 회원 등급 관리, 포인트 수기 지급 및 차단 처리
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-neutral-950 p-4 border border-neutral-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="아이디, 회원명, 이메일, 휴대폰 번호 검색"
            className="w-full bg-neutral-900 border border-neutral-700 p-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 text-xs text-white p-2.5 focus:outline-none"
        >
          <option value="all">전체 등급</option>
          <option value="BRONZE">일반회원 (BRONZE)</option>
          <option value="SILVER">실버회원 (SILVER)</option>
          <option value="GOLD">골드회원 (GOLD)</option>
          <option value="VIP">VIP회원 (VIP)</option>
          <option value="VVIP">VVIP 프리미엄</option>
        </select>
      </div>

      {/* Member Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">회원명 / ID</th>
              <th className="py-3 px-4">이메일</th>
              <th className="py-3 px-4">휴대폰</th>
              <th className="py-3 px-4">회원등급</th>
              <th className="py-3 px-4 text-right">포인트 잔액</th>
              <th className="py-3 px-4 text-center">계정상태</th>
              <th className="py-3 px-4 text-center">관리 액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{m.name}</div>
                  <div className="text-neutral-500 font-mono text-[11px]">{m.login_id}</div>
                </td>
                <td className="py-3 px-4 text-neutral-300 font-mono">{m.email}</td>
                <td className="py-3 px-4 text-neutral-400 font-mono">{m.phone || '-'}</td>
                <td className="py-3 px-4">
                  <select
                    value={m.member_grade}
                    onChange={(e) => handleChangeGrade(m.id, e.target.value as MemberGradeCode)}
                    className="bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-amber-300 p-1"
                  >
                    <option value="BRONZE">BRONZE</option>
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {m.points_balance?.toLocaleString()} P
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      m.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {m.status === 'active' ? '정상 활동' : '이용 차단'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMember(m);
                        setShowPointModal(true);
                      }}
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium"
                    >
                      포인트 지급
                    </button>
                    <button
                      onClick={() => handleToggleBlock(m.id)}
                      className={`px-2 py-1 text-[11px] font-medium ${
                        m.status === 'blocked'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-red-900/60 hover:bg-red-800 text-red-200'
                      }`}
                    >
                      {m.status === 'blocked' ? '차단 해제' : '차단'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Point Adjustment Modal */}
      {showPointModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-sm w-full space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white">
              {selectedMember.name}님 포인트 지급/차감
            </h3>
            <form onSubmit={handleAdjustPoints} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">변동 포인트 수량</label>
                <input
                  type="number"
                  required
                  value={pointDelta}
                  onChange={(e) => setPointDelta(Number(e.target.value))}
                  placeholder="예: 5000 또는 -2000"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">지급 사유 / 메모</label>
                <input
                  type="text"
                  required
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowPointModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#721b29] text-white font-bold"
                >
                  적용하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
