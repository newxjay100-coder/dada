import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Check } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'O'>('F');
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

    setIsSubmitting(true);
    const res = await signup({
      login_id: loginId,
      email,
      password,
      name,
      phone,
      birthday,
      gender,
      marketing_consent: marketingConsent,
      terms_consent: termsConsent,
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast('회원가입이 완료되었습니다! 웰컴 5,000P 및 10% 쿠폰이 지급되었습니다.', 'success');
      navigate('/mypage');
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
          <h2 className="text-xl font-bold text-neutral-900 mt-2">회원가입</h2>
          <p className="text-xs text-neutral-500 mt-1">
            가입 즉시 5,000원 웰컴 적립금 및 10% 할인 쿠폰팩 지급
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">
              아이디 <span className="text-[#721b29]">*</span>
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
              이메일 주소 <span className="text-[#721b29]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@dassoba.kr"
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
                이름 <span className="text-[#721b29]">*</span>
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
            <label className="flex items-center gap-2 cursor-pointer text-neutral-800">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>[선택] 신상품 및 이벤트 혜택 알림(SMS/Email) 수신 동의</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold text-xs tracking-widest uppercase transition-colors shadow-sm mt-4"
          >
            {isSubmitting ? '가입 처리 중...' : '회원가입 완료'}
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
