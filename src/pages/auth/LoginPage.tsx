import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, ArrowRight, UserCheck, AlertCircle, Zap, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [loginIdOrEmail, setLoginIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idError, setIdError] = useState('');
  const [pwError, setPwError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIdError('');
    setPwError('');

    let hasError = false;
    if (!loginIdOrEmail.trim()) {
      setIdError('아이디 또는 이메일을 입력해주세요.');
      hasError = true;
    }
    if (!password) {
      setPwError('비밀번호를 입력해주세요.');
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    const res = await login(loginIdOrEmail.trim(), password);
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
      const msg = res.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  };

  const handleQuickLogin = async (id: string) => {
    setErrorMessage('');
    setIdError('');
    setPwError('');
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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#07070e] py-16 px-4 font-mono">
      <div className="bg-[#0e0e1b] max-w-md w-full p-8 md:p-10 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.2)] space-y-6">
        <div className="text-center">
          <Link to="/" className="text-2xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            DASSOBA // 2077
          </Link>
          <h2 className="text-xl font-bold text-white mt-2">시스템 로그인</h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            다써바 사이버 스트릿 플랫폼에 오신 것을 환영합니다.
          </p>
        </div>

        {/* Quick Demo Test Logins */}
        <div className="bg-[#131326] p-3.5 border border-cyan-500/30 rounded-xl text-xs space-y-2">
          <span className="font-bold text-cyan-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            원클릭 테스트 로그인
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('vipuser')}
              className="py-2 px-3 bg-[#1a1a36] hover:bg-cyan-500 hover:text-black border border-cyan-500/40 text-cyan-300 font-bold text-center transition-all rounded shadow-sm"
            >
              VIP 회원 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-3 bg-pink-950/80 hover:bg-pink-500 hover:text-white border border-pink-500/50 text-pink-300 font-bold text-center transition-all rounded shadow-sm"
            >
              관리자 로그인
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/60 text-xs rounded-xl text-red-200 flex items-start gap-2 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed font-bold font-sans">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1 font-bold">
              아이디 또는 이메일
            </label>
            <div className="relative">
              <input
                type="text"
                value={loginIdOrEmail}
                onChange={(e) => {
                  setLoginIdOrEmail(e.target.value);
                  if (idError) setIdError('');
                }}
                placeholder="아이디 또는 이메일 주소"
                className={`w-full p-3 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                  idError
                    ? 'border-red-500 bg-red-950/20 focus:border-red-400'
                    : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                }`}
              />
            </div>
            {idError && (
              <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{idError}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-bold">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (pwError) setPwError('');
                }}
                placeholder="비밀번호를 입력하세요"
                className={`w-full p-3 bg-[#151528] rounded-lg border transition-all text-white placeholder-neutral-500 focus:outline-none ${
                  pwError
                    ? 'border-red-500 bg-red-950/20 focus:border-red-400'
                    : 'border-cyan-500/30 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                }`}
              />
            </div>
            {pwError && (
              <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{pwError}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <Link to="/forgot-id" className="hover:text-cyan-300 transition-colors">
              아이디 찾기
            </Link>
            <span>•</span>
            <Link to="/forgot-password" className="hover:text-cyan-300 transition-colors">
              비밀번호 찾기
            </Link>
            <span>•</span>
            <Link to="/register" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">
              회원가입 (일반/관리자)
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-pink-500 disabled:opacity-50 text-black font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] mt-2 rounded-lg"
          >
            {isSubmitting ? '인증 확인 중...' : '시스템 로그인 (LOGIN)'}
          </button>
        </form>
      </div>
    </div>
  );
};
