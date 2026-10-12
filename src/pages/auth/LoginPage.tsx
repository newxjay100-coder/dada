import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdOrEmail) return;

    setIsSubmitting(true);
    const res = await login(loginIdOrEmail, password);
    setIsSubmitting(false);

    if (res.success) {
      if (loginIdOrEmail.toLowerCase() === 'admin') {
        showToast('관리자 계정으로 로그인되었습니다.', 'success');
        navigate('/admin');
      } else {
        const storedUser = localStorage.getItem('dassoba_current_user');
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        if (parsed?.role === 'admin') {
          showToast('관리자 계정으로 로그인되었습니다.', 'success');
          navigate('/admin');
        } else {
          showToast('성공적으로 로그인되었습니다.', 'success');
          navigate('/mypage');
        }
      }
    } else {
      showToast(res.message || '로그인에 실패했습니다.', 'error');
    }
  };

  const handleQuickLogin = async (id: string) => {
    setIsSubmitting(true);
    const res = await login(id, 'password123');
    setIsSubmitting(false);
    if (res.success) {
      showToast(`${id === 'admin' ? '관리자' : 'VIP 고객'} 계정으로 로그인되었습니다.`, 'success');
      if (id === 'admin') navigate('/admin');
      else navigate('/mypage');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-md w-full p-8 md:p-10 border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center">
          <Link to="/" className="font-serif text-2xl font-black text-neutral-900 tracking-tight">
            DASSOBA
          </Link>
          <h2 className="text-xl font-bold text-neutral-900 mt-2">로그인</h2>
          <p className="text-xs text-neutral-500 mt-1">
            다써바에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Quick Demo Test Logins */}
        <div className="bg-neutral-50 p-3.5 border border-neutral-200 text-xs space-y-2">
          <span className="font-bold text-neutral-700 block">원클릭 테스트 로그인</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('vipuser')}
              className="py-2 px-3 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 font-semibold text-center transition-colors shadow-2xs"
            >
              VIP 회원 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-center transition-colors shadow-2xs"
            >
              관리자 로그인
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-600 mb-1 font-semibold">
              아이디 또는 이메일
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={loginIdOrEmail}
                onChange={(e) => setLoginIdOrEmail(e.target.value)}
                placeholder="아이디 또는 이메일 주소"
                className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-600 mb-1 font-semibold">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <Link to="/auth/forgot-id" className="hover:underline">
              아이디 찾기
            </Link>
            <span>•</span>
            <Link to="/auth/forgot-password" className="hover:underline">
              비밀번호 찾기
            </Link>
            <span>•</span>
            <Link to="/auth/register" className="text-[#721b29] font-bold hover:underline">
              회원가입 (일반/관리자)
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-bold text-xs tracking-widest uppercase transition-colors shadow-sm mt-2"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};
