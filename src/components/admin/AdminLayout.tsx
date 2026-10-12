import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Shirt,
  ShoppingBag,
  FileSpreadsheet,
  Boxes,
  Layers,
  Receipt,
  Truck,
  Sparkles,
  ExternalLink,
  Shield,
  LogOut,
  Bell,
  Menu,
  X,
  Cloud,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, switchUserRole } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenus = [
    { label: '대시보드', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: '⚡ Supabase 연동 센터', path: '/admin/supabase', icon: Cloud, highlight: true },
    { label: '회원 관리', path: '/admin/members', icon: Users },
    { label: '상품 관리', path: '/admin/products', icon: Shirt },
    { label: '주문 관리', path: '/admin/orders', icon: ShoppingBag },
    { label: '발주 관리 (PO)', path: '/admin/purchase-orders', icon: FileSpreadsheet },
    { label: '재고 관리 & 입출고', path: '/admin/inventory', icon: Boxes },
    { label: '원부자재 관리', path: '/admin/materials', icon: Layers },
    { label: '세금계산서 / 영수증', path: '/admin/tax-documents', icon: Receipt },
    { label: '배송 / 송장 관리', path: '/admin/delivery', icon: Truck },
    { label: '이벤트 & 기획전', path: '/admin/events', icon: Sparkles },
  ];

  // ==========================================
  // Strict Admin Access Control (단 관리자만 가능)
  // ==========================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#07070e] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0d0d1a] border border-pink-500/40 p-8 rounded-2xl shadow-[0_0_30px_rgba(255,0,127,0.3)] text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-pink-950/80 border border-pink-500 flex items-center justify-center mx-auto text-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.5)]">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">
              RESTRICTED SECURITY ZONE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              관리자 전용 콘솔 접근 통제
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              본 시스템은 DASSOBA 관리자 전용 ERP 백오피스입니다.<br />
              모든 자료 및 Supabase 관리/업로드 기능은 관리자 권한만 가능합니다.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => switchUserRole('admin')}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase rounded-lg shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all"
            >
              ⚡ 관리자(ADMIN) 권한으로 전환 &amp; 입장
            </button>

            <Link
              to="/login?redirect=/admin"
              className="block w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
            >
              관리자 계정으로 로그인하기
            </Link>

            <Link
              to="/"
              className="block text-xs font-mono text-neutral-500 hover:text-cyan-400 transition-colors pt-2"
            >
              ← 일반 쇼핑몰 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-neutral-950 border-b border-neutral-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#942537]" />
          <span className="font-serif font-black tracking-tight text-white text-base">
            DASSOBA ADMIN
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 text-neutral-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#721b29] flex items-center justify-center font-serif font-bold text-white text-base">
                D
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-tight text-white block">
                  DASSOBA BACKOFFICE
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  v2.6 Enterprise ERP
                </span>
              </div>
            </Link>
          </div>

          {/* Menus */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] text-xs">
            {adminMenus.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                end={menu.exact}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-none font-medium transition-all ${
                    isActive
                      ? 'bg-[#721b29] text-white font-bold shadow-xs'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`
                }
              >
                <menu.icon className="w-4 h-4 shrink-0" />
                <span>{menu.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Storefront Link & Admin Session */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 text-xs space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded text-[11px] font-medium"
          >
            <span>고객 쇼핑몰 바로가기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user?.name || '관리자'}</span>
            </div>
            <button
              onClick={() => {
                switchUserRole('customer');
                navigate('/');
              }}
              className="text-neutral-400 hover:text-amber-400 underline"
            >
              고객 전환
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f11] overflow-x-hidden">
        {/* Admin Top Navbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-neutral-800/80 bg-neutral-950 text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 font-mono text-[10px]">
              PROD-CLUSTER-KR-01
            </span>
            <span className="text-neutral-400">
              다써바 통합 패션 전자상거래 관리자 콘솔
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">
              오늘: <strong className="text-white font-mono">{new Date().toISOString().split('T')[0]}</strong>
            </span>
            <Link
              to="/"
              className="px-3 py-1.5 border border-neutral-700 hover:border-neutral-400 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              쇼핑몰 열기 <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
