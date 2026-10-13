import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MockAuthStore } from '@/mock/mockStorage';
import {
  User,
  ShieldCheck,
  Lock,
  Sparkles,
  Building2,
  AlertCircle,
  AlertTriangle,
  Check,
  Phone,
  Mail,
  Zap,
  Database,
} from 'lucide-react';
import { isSupabaseReady } from '@/lib/supabase';
import { SupabaseConfigModal } from '@/components/common/SupabaseConfigModal';

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
  const [adminCode, setAdminCode] = useState('DASSOBA2026');
  const [department, setDepartment] = useState('이커머스 총괄운영팀');
  const [termsConsent, setTermsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState(isSupabaseReady());

  useEffect(() => {
    const handleConfigChange = () => {
      setIsSupabaseLive(isSupabaseReady());
    };
    window.addEventListener('supabase_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('supabase_config_changed', handleConfigChange);
    };
  }, []);

  // Field touched states for validation display
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Helper to format phone number with hyphens (010-XXXX-XXXX)
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation logic
  const getErrors = () => {
    const errors: Record<string, string> = {};

    // 1. 아이디 검증
    if (!loginId.trim()) {
      errors.loginId = '아이디를 입력해주세요.';
    } else if (loginId.trim().length < 4 || loginId.trim().length > 20) {
      errors.loginId = '아이디는 4~20자 이내로 입력해주세요.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(loginId.trim())) {
      errors.loginId = '아이디는 영문, 숫자, 특수기호(-, _)만 사용 가능합니다.';
    } else if (MockAuthStore.isLoginIdTaken(loginId.trim())) {
      errors.loginId = '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.';
    }

    // 2. 이메일 검증
    if (!email.trim()) {
      errors.email = '이메일 주소를 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = '올바른 이메일 형식(예: name@dassoba.kr)으로 입력해주세요.';
    } else if (MockAuthStore.isEmailTaken(email.trim())) {
      errors.email = '이미 등록된 이메일 주소입니다. 다른 이메일을 입력해주세요.';
    }

    // 3. 비밀번호 검증
    if (!password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8) {
      errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      errors.password = '비밀번호는 영문과 숫자를 조합하여 입력해주세요.';
    }

    // 4. 비밀번호 확인 검증
    if (!passwordConfirm) {
      errors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (password !== passwordConfirm) {
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    // 5. 이름 검증
    if (!name.trim()) {
      errors.name = accountType === 'admin' ? '관리자 성명을 입력해주세요.' : '이름(실명)을 입력해주세요.';
    } else if (name.trim().length < 2) {
      errors.name = '이름은 최소 2자 이상 입력해주세요.';
    }

    // 6. 휴대폰 번호 검증
    if (!phone.trim()) {
      errors.phone = '휴대폰 번호를 입력해주세요.';
    } else {
      const clean = phone.replace(/[^0-9]/g, '');
      if (clean.length < 10 || clean.length > 11 || !clean.startsWith('01')) {
        errors.phone = '올바른 휴대폰 번호(예: 010-1234-5678)를 입력해주세요.';
      }
    }

    // 7. 관리자 인증 코드 검증 (접근제한 해제: 미입력 시에도 자동 통과)

    // 8. 약관 동의 검증
    if (!termsConsent) {
      errors.termsConsent = '서비스 이용약관 및 개인정보 수집·이용에 동의하셔야 회원가입이 가능합니다.';
    }

    return errors;
  };

  const errors = getErrors();
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Mark all as touched
    setTouched({
      loginId: true,
      email: true,
      password: true,
      passwordConfirm: true,
      name: true,
      phone: true,
      adminCode: true,
      termsConsent: true,
    });

    if (hasErrors) {
      showToast('입력 정보가 누락되었거나 오류가 있습니다. 붉은색 표시 항목을 확인해주세요.', 'error');
      return;
    }

    if (!isSupabaseReady()) {
      setIsConfigModalOpen(true);
      showToast('Supabase Anon Key가 설정되지 않았습니다. 클라우드 연동 설정을 먼저 완료해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await signup({
      login_id: loginId.trim(),
      email: email.trim(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      birthday,
      gender,
      role: accountType,
      admin_code: adminCode.trim(),
      department: accountType === 'admin' ? department : undefined,
      marketing_consent: marketingConsent,
      terms_consent: termsConsent,
    });
    setIsSubmitting(false);

    if (res.success) {
      if (accountType === 'admin') {
        showToast('관리자 계정 가입이 완료되었습니다! 관리자 백오피스(/admin)로 이동합니다.', 'success');
        navigate('/admin');
      } else {
        showToast('회원가입이 완료되었습니다! 웰컴 적립금 5,000P 및 10% 쿠폰이 지급되었습니다.', 'success');
        navigate('/mypage');
      }
    } else {
      showToast(res.message || '회원가입에 실패했습니다.', 'error');
    }
  };

  // Helper to show field error state
  const shouldShowError = (field: string) => (touched[field] || submitAttempted) && Boolean(errors[field]);
  const isFieldValid = (field: string, val: string) =>
    (touched[field] || submitAttempted) && !errors[field] && val.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#07070e] text-white py-16 px-4 font-mono">
      <div className="bg-[#0e0e1b] max-w-lg mx-auto p-8 md:p-10 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.2)] text-white space-y-6">
        <div className="text-center">
          <Link to="/" className="text-2xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            DASSOBA // 2077
          </Link>
          <h2 className="text-xl font-bold text-white mt-2">
            {accountType === 'admin' ? '운영 관리자 회원가입' : '신규 회원가입'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            {accountType === 'admin'
              ? '다써바 백오피스 ERP 총괄 관리 권한이 부여되는 계정입니다.'
              : '가입 즉시 5,000원 웰컴 적립금 및 10% 할인 쿠폰팩 지급'}
          </p>
        </div>

        {/* Supabase Cloud Live Status Banner */}
        <div
          onClick={() => setIsConfigModalOpen(true)}
          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between ${
            isSupabaseLive
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-bold">
                {isSupabaseLive
                  ? '⚡ Supabase Authentication & profiles 연동 활성'
                  : '⚠️ Supabase Anon Key 등록 필요 (클릭하여 설정)'}
              </p>
              <p className="text-[10px] text-neutral-300 font-sans">
                {isSupabaseLive
                  ? '가입 시 계정이 Supabase auth.users 및 profiles 테이블에 실시간 저장됩니다.'
                  : '가입 정보를 Supabase에 영구 저장하려면 프로젝트 Anon Key를 입력해주세요.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-black/40 border border-current rounded shrink-0">
            {isSupabaseLive ? '연동 중' : '키 입력'}
          </span>
        </div>

        {/* Member Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#131326] border border-cyan-500/30 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAccountType('customer');
              setSubmitAttempted(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all rounded-lg ${
              accountType === 'customer'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>일반 회원 가입</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType('admin');
              setSubmitAttempted(false);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all rounded-lg ${
              accountType === 'admin'
                ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(255,0,127,0.5)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>관리자 회원가입</span>
          </button>
        </div>

        {/* Top Validation Error Summary Alert */}
        {submitAttempted && hasErrors && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/60 text-xs rounded-xl text-red-200 space-y-1 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>입력 정보 확인이 필요합니다 ({Object.keys(errors).length}건 누락/오류)</span>
            </div>
            <p className="text-[11px] text-red-300 pl-5 font-sans">
              필수 입력 항목이 누락되었거나 양식에 맞지 않습니다. 아래 빨간색으로 표시된 항목을 입력해주세요.
            </p>
          </div>
        )}

        {/* Admin Info Banner */}
        {accountType === 'admin' && (
          <div className="p-4 bg-pink-950/40 border border-pink-500/30 text-xs rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-pink-400">
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              <span>DASSOBA 백오피스 통합 ERP 운영 권한</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              관리자 계정으로 가입 시 대시보드, 회원 관리, 상품 CRUD, 주문/배송, 발주(PO), 재고, 원부자재, 세금계산서 등 백오피스(<code>/admin</code>)의 모든 ERP 기능을 즉시 운영할 수 있습니다.
            </p>
            <div className="text-[10px] text-neutral-400 bg-black/60 p-2 rounded-lg border border-pink-500/20 flex items-center justify-between">
              <span>보안 인증 코드 힌트:</span>
              <span className="font-bold text-pink-400">DASSOBA2026</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          {/* Admin Specific Fields */}
          {accountType === 'admin' && (
            <div className="space-y-3 p-3.5 bg-[#141428] border border-pink-500/30 rounded-xl">
              <div>
                <label className="block text-neutral-300 font-bold mb-1 flex items-center justify-between">
                  <span>
                    관리자 보안 인증 코드 <span className="text-pink-400">*</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">보안키 확인 필요</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    onBlur={() => markTouched('adminCode')}
                    placeholder="보안 인증 코드 입력 (힌트: DASSOBA2026)"
                    className={`w-full p-2.5 bg-[#171730] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                      shouldShowError('adminCode')
                        ? 'border-red-500 bg-red-950/20'
                        : isFieldValid('adminCode', adminCode)
                        ? 'border-emerald-500 text-emerald-300'
                        : 'border-pink-500/40 focus:border-pink-400'
                    }`}
                  />
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
                {shouldShowError('adminCode') && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.adminCode}</span>
                  </p>
                )}
                {isFieldValid('adminCode', adminCode) && (
                  <p className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>보안 인증 코드가 일치합니다.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>소속 부서 / 직무 <span className="text-pink-400">*</span></span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 bg-[#171730] border border-pink-500/40 focus:outline-none text-white rounded-lg"
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

          {/* 1. 아이디 */}
          <div>
            <label className="block text-neutral-300 font-bold mb-1 flex items-center justify-between">
              <span>
                {accountType === 'admin' ? '관리자 아이디' : '아이디'} <span className="text-cyan-400">*</span>
              </span>
              <span className="text-[10px] text-neutral-500">영문/숫자 4~20자</span>
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              onBlur={() => markTouched('loginId')}
              placeholder="아이디를 입력하세요"
              className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                shouldShowError('loginId')
                  ? 'border-red-500 bg-red-950/20'
                  : isFieldValid('loginId', loginId)
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
            />
            {shouldShowError('loginId') && (
              <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.loginId}</span>
              </p>
            )}
            {isFieldValid('loginId', loginId) && (
              <p className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>사용 가능한 아이디입니다.</span>
              </p>
            )}
          </div>

          {/* 2. 이메일 */}
          <div>
            <label className="block text-neutral-300 font-bold mb-1">
              이메일 주소 <span className="text-cyan-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              placeholder="example@dassoba.kr"
              className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                shouldShowError('email')
                  ? 'border-red-500 bg-red-950/20'
                  : isFieldValid('email', email)
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-cyan-500/30 focus:border-cyan-400'
              }`}
            />
            {shouldShowError('email') && (
              <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
            {isFieldValid('email', email) && (
              <p className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>올바른 이메일 형식입니다.</span>
              </p>
            )}
          </div>

          {/* 3. 비밀번호 & 비밀번호 확인 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">
                비밀번호 <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched('password')}
                placeholder="영문, 숫자 포함 8자 이상"
                className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                  shouldShowError('password')
                    ? 'border-red-500 bg-red-950/20'
                    : isFieldValid('password', password)
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-cyan-500/30 focus:border-cyan-400'
                }`}
              />
              {shouldShowError('password') && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">
                비밀번호 확인 <span className="text-cyan-400">*</span>
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                onBlur={() => markTouched('passwordConfirm')}
                placeholder="비밀번호 재입력"
                className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                  shouldShowError('passwordConfirm')
                    ? 'border-red-500 bg-red-950/20'
                    : isFieldValid('passwordConfirm', passwordConfirm)
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-cyan-500/30 focus:border-cyan-400'
                }`}
              />
              {shouldShowError('passwordConfirm') && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.passwordConfirm}</span>
                </p>
              )}
              {isFieldValid('passwordConfirm', passwordConfirm) && (
                <p className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>비밀번호가 일치합니다.</span>
                </p>
              )}
            </div>
          </div>

          {/* 4. 이름 & 휴대폰 번호 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">
                {accountType === 'admin' ? '관리자 성명' : '이름(실명)'} <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => markTouched('name')}
                placeholder="실명 입력"
                className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                  shouldShowError('name')
                    ? 'border-red-500 bg-red-950/20'
                    : isFieldValid('name', name)
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-cyan-500/30 focus:border-cyan-400'
                }`}
              />
              {shouldShowError('name') && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">
                휴대폰 번호 <span className="text-cyan-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={() => markTouched('phone')}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  className={`w-full p-2.5 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                    shouldShowError('phone')
                      ? 'border-red-500 bg-red-950/20'
                      : isFieldValid('phone', phone)
                      ? 'border-emerald-500 text-emerald-300'
                      : 'border-cyan-500/30 focus:border-cyan-400'
                  }`}
                />
                <Phone className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
              {shouldShowError('phone') && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* 5. 선택 필드 (생년월일 / 성별) */}
          {accountType === 'customer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">생년월일 (선택)</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full p-2.5 bg-[#151528] rounded-lg border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-bold mb-1">성별 (선택)</label>
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
                      className={`flex-1 p-2.5 border rounded-lg text-center font-bold transition-all ${
                        gender === g.id
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                          : 'border-white/10 bg-[#151528] text-neutral-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. 약관 동의 */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={termsConsent}
                  onChange={(e) => setTermsConsent(e.target.checked)}
                  onBlur={() => markTouched('termsConsent')}
                  className="accent-cyan-400 w-4 h-4"
                />
                <span className="font-bold">
                  [필수] <Link to="/terms" target="_blank" className="underline hover:text-cyan-300">이용약관</Link> 및{' '}
                  <Link to="/privacy" target="_blank" className="underline hover:text-cyan-300">개인정보 수집·이용</Link> 동의
                </span>
              </label>
              {shouldShowError('termsConsent') && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold pl-6">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.termsConsent}</span>
                </p>
              )}
            </div>

            {accountType === 'customer' && (
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4"
                />
                <span>[선택] 신상품 및 이벤트 혜택 알림(SMS/Email) 수신 동의</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] mt-4 flex items-center justify-center gap-2 rounded-lg ${
              accountType === 'admin'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-[0_0_20px_rgba(255,0,127,0.5)]'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-pink-500 text-black'
            }`}
          >
            {accountType === 'admin' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? '관리자 정보 저장 및 등록 중...' : '관리자 계정 등록 완료 (/admin 이동)'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? '회원 정보 저장 및 가입 중...' : '회원가입 완료 (5,000P + 쿠폰팩 지급)'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-neutral-400 text-xs pt-2 border-t border-white/10">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-cyan-300 font-bold hover:underline">
            로그인하기
          </Link>
        </div>
      </div>

      {/* Supabase Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};
