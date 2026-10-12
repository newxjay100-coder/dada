import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';

export const ForgotIdPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFoundId('vipuser (또는 등록하신 이메일: vip@dassoba.kr)');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-md w-full p-8 border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-neutral-900">아이디 찾기</h2>
          <p className="text-xs text-neutral-500 mt-1">
            가입 시 등록하신 이름과 휴대폰 번호를 입력해 주세요.
          </p>
        </div>

        {foundId ? (
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 border border-neutral-200 text-center text-xs">
              <span className="text-neutral-500 block mb-1">조회된 아이디</span>
              <strong className="text-sm text-neutral-900">{foundId}</strong>
            </div>
            <Link
              to="/auth/login"
              className="block w-full py-3 bg-neutral-900 text-white text-center text-xs font-bold uppercase"
            >
              로그인하러 가기
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름 입력"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">휴대폰 번호</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase mt-2"
            >
              아이디 찾기
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('비밀번호 재설정 인증 메일이 발송되었습니다.', 'success');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-md w-full p-8 border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-neutral-900">비밀번호 찾기</h2>
          <p className="text-xs text-neutral-500 mt-1">
            가입하신 이메일 주소로 임시 재설정 링크를 보내드립니다.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-xs text-center">
            <p className="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200">
              <strong>{email}</strong>(으)로 비밀번호 재설정 메일을 발송했습니다.
              메일함의 링크를 확인해 주세요.
            </p>
            <Link
              to="/auth/reset-password"
              className="block w-full py-3 bg-neutral-900 text-white text-xs font-bold uppercase"
            >
              비밀번호 재설정 페이지로 이동
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">이메일 주소</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@dassoba.kr"
                className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase mt-2"
            >
              인증 메일 발송
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    showToast('비밀번호가 안전하게 변경되었습니다. 새 비밀번호로 로그인해 주세요.', 'success');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-md w-full p-8 border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-neutral-900">새 비밀번호 설정</h2>
          <p className="text-xs text-neutral-500 mt-1">
            새로운 비밀번호를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">새 비밀번호</label>
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
            <label className="block text-neutral-700 font-semibold mb-1">새 비밀번호 확인</label>
            <input
              type="password"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호 재입력"
              className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase mt-2"
          >
            비밀번호 변경하기
          </button>
        </form>
      </div>
    </div>
  );
};
