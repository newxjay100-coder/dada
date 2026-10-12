import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, ShieldCheck, Lock, Sparkles, Building2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [accountType, setAccountType] = useState<'customer' | 'admin'>('customer');
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O'>('F');
  const [adminCode, setAdminCode] = useState('');
  const [department, setDepartment] = useState('이커머스 총괄운영팀');
  const [termsConsent, setTermsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsConsent) {
      showToast('이용약관 및 개인정보처리방침에 동의해 주세요.', 'error');
      return;
    }
    if (password !== passwordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    if (accountType === 'admin') {
      const code = adminCode.trim().toUpperCase();
      if (!code) {
        showToast('관리자 보안 인증 코드를 입력해 주세요.', 'error');
        return;
      }
      if (code !== 'DASSOBA2026' && code !== 'ADMIN') {
        showToast('관리자 보안 인증 코드가 올바르지 않습니다. (인증 힌트: DASSOBA2026)', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    const res = await signup({
      login_id: loginId,
      email,
      password,
      name,
      phone,
      birthday,
      gender,
      role: accountType,
      admin_code: adminCode,
      department: accountType === 'admin' ? department : undefined,
      marketing_consent: marketingConsent,
      terms_consent: termsConsent,
    });
    setIsSubmitting(false);

    if (res.success) {
      if (accountType === 'admin') {
        showToast('관리자 계정 생성이 완료되었습니다! 관리자 백오피스로 이동합니다.', 'success');
        navigate('/admin');
      } else {
        showToast('회원가입이 완료되었습니다! 웰컴 5,000P 및 10% 쿠폰이 지급되었습니다.', 'success');
        navigate('/mypage');
      }
    } else {
      showToast(res.message || '회원가입에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-lg mx-auto p-8 md:p-10 border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center">
          <Link to="/" className="font-serif text-2xl font-black text-neutral-900 tracking-tight">
            DASSOBA
          </Link>
          <h2 className="text-xl font-bold text-neutral-900 mt-2">
            {accountType === 'admin' ? '운영 관리자 회원가입' : '회원가입'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {accountType === 'admin'
              ? '다써바 백오피스 ERP 총괄 관리 권한이 부여되는 계정입니다.'
              : '가입 즉시 5,000원 웰컴 적립금 및 10% 할인 쿠폰팩 지급'}
          </p>
        </div>

        {/* Member Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-md">
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all rounded ${
              accountType === 'customer'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>일반 회원 가입</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('admin')}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all rounded ${
              accountType === 'admin'
                ? 'bg-[#721b29] text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>관리자 회원가입</span>
          </button>
        </div>

        {/* Admin Info Box */}
        {accountType === 'admin' && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 text-xs rounded space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#721b29]">
              <ShieldCheck className="w-4 h-4 text-[#721b29]" />
              <span>DASSOBA 백오피스 통합 ERP 운영 권한</span>
            </div>
            <p className="text-[11px] text-neutral-700 leading-relaxed font-light">
              관리자 계정으로 가입 시 대시보드, 회원 관리, 상품 CRUD, 주문/배송, 발주(PO), 재고, 원부자재, 세금계산서 등 백오피스(<code>/admin</code>)의 모든 ERP 기능을 즉시 운영할 수 있습니다.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono bg-white/80 p-2 rounded border border-amber-100 flex items-center justify-between">
              <span>보안 인증 코드 힌트:</span>
              <span className="font-bold text-[#721b29]">DASSOBA2026</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Admin Specific Fields */}
          {accountType === 'admin' && (
            <div className="space-y-3 p-3.5 bg-neutral-50 border border-neutral-200">
              <div>
                <label className="block text-neutral-800 font-semibold mb-1 flex items-center justify-between">
                  <span>
                    관리자 보안 인증 코드 <span className="text-[#721b29]">*</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">보안키 확인 필요</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="보안 인증 코드 입력 (힌트: DASSOBA2026)"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-[#721b29] bg-white pr-8 font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-800 font-semibold mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span>소속 부서 / 직무 <span className="text-[#721b29]">*</span></span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900 bg-white"
                >
                  <option value="이커머스 총괄운영팀">이커머스 총괄운영팀 (Store Director)</option>
                  <option value="MD 상품기획팀">MD 상품기획팀 (Merchandising)</option>
                  <option value="물류 & ERP 관리팀">물류 & SCM/ERP 관리팀 (Inventory / PO)</option>
                  <option value="CS 고객경험지원팀">CS 고객경험지원팀 (Customer Support)</option>
                  <option value="재무 & 세무회계팀">재무 & 세무회계팀 (Finance / Tax)</option>
                  <option value="플랫폼 시스템 개발팀">플랫폼 시스템 개발팀 (Engineering)</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              {accountType === 'admin' ? '관리자 아이디' : '아이디'} <span className="text-[#721b29]">*</span>
            </label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="영문, 숫자 조합 4~20자"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              {accountType === 'admin' ? '업무용 이메일 주소' : '이메일 주소'} <span className="text-[#721b29]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={accountType === 'admin' ? 'admin@dassoba.kr' : 'example@dassoba.kr'}
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                비밀번호 <span className="text-[#721b29]">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="영문, 숫자 포함 8자 이상"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                비밀번호 확인 <span className="text-[#721b29]">*</span>
              </label>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                {accountType === 'admin' ? '관리자 성명' : '이름'} <span className="text-[#721b29]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="실명 입력"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                휴대폰 번호 <span className="text-[#721b29]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {accountType === 'customer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  생년월일 (선택)
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  성별 (선택)
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'F', label: '여성' },
                    { id: 'M', label: '남성' },
                    { id: 'O', label: '선택 안함' },
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setGender(g.id as any)}
                      className={`flex-1 p-2.5 border text-center font-medium ${
                        gender === g.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 bg-white text-neutral-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Consents */}
          <div className="pt-3 border-t border-neutral-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-800">
              <input
                type="checkbox"
                required
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>[필수] 이용약관 및 개인정보 수집·이용 동의</span>
            </label>
            {accountType === 'customer' && (
              <label className="flex items-center gap-2 cursor-pointer text-neutral-800">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="accent-neutral-900"
                />
                <span>[선택] 신상품 및 이벤트 혜택 알림(SMS/Email) 수신 동의</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-white font-bold text-xs tracking-widest uppercase transition-colors shadow-sm mt-4 flex items-center justify-center gap-2 ${
              accountType === 'admin'
                ? 'bg-[#721b29] hover:bg-[#58131e] disabled:bg-neutral-400'
                : 'bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400'
            }`}
          >
            {accountType === 'admin' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? '관리자 등록 처리 중...' : '관리자 계정 등록 완료 (/admin 이동)'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? '가입 처리 중...' : '회원가입 완료 (5,000P 지급)'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-neutral-500 text-xs">
          이미 계정이 있으신가요?{' '}
          <Link to="/auth/login" className="text-neutral-900 font-bold hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};
