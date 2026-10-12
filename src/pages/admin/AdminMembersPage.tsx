import React, { useState, useEffect } from 'react';
import { Profile, MemberGradeCode, UserStatus, UserRole } from '@/types/database.types';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import {
  Search,
  Shield,
  Ban,
  CheckCircle,
  Coins,
  Tag,
  Edit3,
  Plus,
  Trash2,
  Cloud,
  UserPlus,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointDelta, setPointDelta] = useState(1000);
  const [pointReason, setPointReason] = useState('우수 고객 감사 적립');

  // Member Create / Edit Modal state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const [formLoginId, setFormLoginId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGrade, setFormGrade] = useState<MemberGradeCode>('BRONZE');
  const [formRole, setFormRole] = useState<UserRole>('customer');
  const [formPoints, setFormPoints] = useState(3000);

  const { showToast } = useToast();

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProfiles();
      setMembers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormLoginId('');
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormGrade('BRONZE');
    setFormRole('customer');
    setFormPoints(3000);
    setShowMemberModal(true);
  };

  const handleOpenEdit = (m: Profile) => {
    setEditingMember(m);
    setFormLoginId(m.login_id);
    setFormName(m.name);
    setFormEmail(m.email);
    setFormPhone(m.phone || '');
    setFormGrade(m.member_grade);
    setFormRole(m.role || 'customer');
    setFormPoints(m.points_balance);
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLoginId.trim() || !formName.trim() || !formEmail.trim()) {
      showToast('필수 회원 정보를 모두 입력해주세요.', 'error');
      return;
    }

    const target: Profile = {
      id: editingMember?.id || `user-${Date.now()}`,
      login_id: formLoginId.trim(),
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || undefined,
      member_grade: formGrade,
      role: formRole,
      points_balance: formPoints,
      status: editingMember?.status || 'active',
      marketing_consent: editingMember?.marketing_consent ?? true,
      terms_consent: editingMember?.terms_consent ?? true,
      created_at: editingMember?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await api.saveProfile(target);
    await loadMembers();
    setShowMemberModal(false);
    showToast(
      editingMember
        ? '회원 정보가 수정되어 Supabase에 실시간 반영되었습니다.'
        : '신규 회원이 등록되어 Supabase에 실시간 업로드되었습니다.',
      'success'
    );
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (window.confirm(`정말로 '${name}' 회원을 영구 삭제하시겠습니까? Supabase 클라우드에서도 즉시 삭제됩니다.`)) {
      await api.deleteProfile(id);
      await loadMembers();
      showToast('회원이 삭제되었습니다 (Supabase 동기화 완료).', 'info');
    }
  };

  const handleToggleBlock = async (member: Profile) => {
    const nextStatus: UserStatus = member.status === 'blocked' ? 'active' : 'blocked';
    const updated = { ...member, status: nextStatus, updated_at: new Date().toISOString() };
    await api.saveProfile(updated);
    await loadMembers();
    showToast(`회원 상태가 '${nextStatus === 'active' ? '정상 활동' : '이용 차단'}'으로 변경되었습니다 (Supabase 반영).`, 'info');
  };

  const handleChangeGrade = async (member: Profile, newGrade: MemberGradeCode) => {
    const updated = { ...member, member_grade: newGrade, updated_at: new Date().toISOString() };
    await api.saveProfile(updated);
    await loadMembers();
    showToast(`회원 등급이 '${newGrade}'(으)로 변경되었습니다 (Supabase 반영).`, 'success');
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    await api.addPointTransaction({
      user_id: selectedMember.id,
      amount: pointDelta,
      description: pointReason,
      transaction_type: 'admin_adjustment',
    });

    await loadMembers();
    setShowPointModal(false);
    showToast(
      `${selectedMember.name}님에게 ${pointDelta > 0 ? '+' : ''}${pointDelta}P가 지급/조정되어 Supabase에 실시간 반영되었습니다.`,
      'success'
    );
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">회원 관리 (MEMBER DIRECTORY)</h1>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              SUPABASE LIVE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            등록된 고객 계정 조회, 신규 회원 직접 등록, 등급 및 적립금 지급, 계정 차단/삭제 (Supabase 실시간 연동)
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
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> 신규 회원 직접 추가
          </button>
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
            className="w-full bg-neutral-900 border border-neutral-700 p-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
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
              <th className="py-3 px-4">역할</th>
              <th className="py-3 px-4">이메일</th>
              <th className="py-3 px-4">휴대폰</th>
              <th className="py-3 px-4">회원등급</th>
              <th className="py-3 px-4 text-right">포인트 잔액</th>
              <th className="py-3 px-4 text-center">계정상태</th>
              <th className="py-3 px-4 text-center">관리 액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500 font-mono">
                  회원 데이터를 불러오는 중...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-neutral-500 font-mono">
                  검색 조건에 일치하는 회원이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-900/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {m.name}
                      {m.role === 'admin' && (
                        <span className="px-1.5 py-0.2 bg-pink-950 text-pink-300 border border-pink-500/40 text-[9px] font-mono rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500 font-mono text-[11px]">{m.login_id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className={m.role === 'admin' ? 'text-pink-400 font-bold' : 'text-neutral-400'}>
                      {m.role === 'admin' ? '관리자' : '일반고객'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-300 font-mono">{m.email}</td>
                  <td className="py-3 px-4 text-neutral-400 font-mono">{m.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={m.member_grade}
                      onChange={(e) => handleChangeGrade(m, e.target.value as MemberGradeCode)}
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
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        title="회원 정보 수정"
                        className="p-1 text-neutral-400 hover:text-cyan-300 hover:bg-neutral-800 rounded transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
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
                        onClick={() => handleToggleBlock(m)}
                        className={`px-2 py-1 text-[11px] font-medium ${
                          m.status === 'blocked'
                            ? 'bg-emerald-800 text-white'
                            : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200'
                        }`}
                      >
                        {m.status === 'blocked' ? '차단 해제' : '차단'}
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        title="회원 영구 삭제"
                        className="p-1 text-neutral-500 hover:text-pink-400 hover:bg-neutral-800 rounded transition-colors"
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

      {/* Member Create / Edit Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                {editingMember ? '회원 정보 수정 (Supabase 동기화)' : '신규 회원 직접 등록 (Supabase)'}
              </h3>
              <button onClick={() => setShowMemberModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">로그인 아이디 (ID) *</label>
                <input
                  type="text"
                  required
                  value={formLoginId}
                  onChange={(e) => setFormLoginId(e.target.value)}
                  placeholder="예: user2077"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">회원 실명 (이름) *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="예: 김사이버"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">이메일 주소 *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@dassoba.kr"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">회원 등급</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as MemberGradeCode)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                  >
                    <option value="BRONZE">일반 (BRONZE)</option>
                    <option value="SILVER">실버 (SILVER)</option>
                    <option value="GOLD">골드 (GOLD)</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP 프리미엄</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">시스템 역할 (Role)</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-bold text-cyan-300"
                  >
                    <option value="customer">일반 고객 (customer)</option>
                    <option value="admin">최고 관리자 (admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">보유 적립금 (Point)</label>
                <input
                  type="number"
                  value={formPoints}
                  onChange={(e) => setFormPoints(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold"
                >
                  {editingMember ? '수정 완료 (Supabase 반영)' : '등록하기 (Supabase 업로드)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Point Adjustment Modal */}
      {showPointModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
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
                  className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white font-mono"
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
                  적용하기 (Supabase 반영)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
