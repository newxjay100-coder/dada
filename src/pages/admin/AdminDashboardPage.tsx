import React from 'react';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  ShoppingBag,
  Truck,
  RotateCcw,
  AlertTriangle,
  UserPlus,
  Coins,
  ArrowUpRight,
  Cloud,
  Database,
  Sparkles,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/mock/seedProducts';
import { INITIAL_ORDERS } from '@/mock/mockData';
import { isSupabaseConfigured, getSupabaseConnectionInfo } from '@/lib/supabase';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const conn = getSupabaseConnectionInfo();

  // Metric stats
  const metrics = [
    { label: '오늘 매출', value: '4,280,000원', change: '+18.4%', isUp: true, icon: TrendingUp },
    { label: '이번달 매출', value: '89,450,000원', change: '+24.1%', isUp: true, icon: Coins },
    { label: '오늘 주문건수', value: '38건', change: '+5건', isUp: true, icon: ShoppingBag },
    { label: '배송 대기', value: '14건', change: '당일 출고 대상', isUp: false, icon: Truck },
    { label: '취소/반품/환불 요청', value: '3건', change: '승인 대기', isUp: false, icon: RotateCcw, alert: true },
    { label: '재고 부족 경보 (SKU)', value: '6개', change: '발주 권장', isUp: false, icon: AlertTriangle, alert: true },
    { label: '신규 가입 회원', value: '52명', change: '+12%', isUp: true, icon: UserPlus },
  ];

  // Best selling products
  const topProducts = INITIAL_PRODUCTS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
            DASSOBA 종합 운영 대시보드
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            실시간 판매 지표, 주문 처리 상태 및 Supabase 클라우드 데이터베이스를 통합 모니터링합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/supabase"
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 font-mono text-xs border border-cyan-500/40 rounded flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all"
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSupabaseConfigured ? '⚡ SUPABASE CLOUD LIVE' : 'SUPABASE 연동 설정'}</span>
          </Link>
        </div>
      </div>

      {/* Supabase Live Status Bar */}
      <div className="p-4 bg-gradient-to-r from-[#0d0d1a] to-[#121224] border border-cyan-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-500/40">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Supabase 데이터베이스 실시간 연동 관리</span>
              <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${isSupabaseConfigured ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-pink-950 text-pink-300 border border-pink-500/40'}`}>
                {isSupabaseConfigured ? 'READY & CONNECTED' : 'KEY REQUIRED'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              엔드포인트: {conn.url} • 모든 상품, 회원, 이미지, 주문이 Supabase와 실시간 연동됩니다.
            </p>
          </div>
        </div>

        <Link
          to="/admin/supabase"
          className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40 rounded text-center transition-colors"
        >
          원클릭 클라우드 동기화 &rarr;
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`p-5 bg-neutral-950 border transition-all ${
              m.alert ? 'border-amber-500/40 bg-amber-950/10' : 'border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between text-neutral-400 mb-3 text-xs">
              <span>{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.alert ? 'text-amber-400' : 'text-neutral-500'}`} />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono mb-1">
              {m.value}
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className={m.isUp ? 'text-emerald-400' : m.alert ? 'text-amber-400' : 'text-neutral-400'}>
                {m.change}
              </span>
              {m.isUp && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Grid: 7일 매출 차트 & 주문 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart Simulation (Cols 7) */}
        <div className="lg:col-span-7 bg-neutral-950 p-6 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-bold text-xs uppercase text-neutral-300 tracking-wider">
              최근 7일 일별 매출 추이 (KRW)
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">단위: 만원</span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: '09/30 (월)', amount: 280, height: '45%' },
              { day: '10/01 (화)', amount: 390, height: '62%' },
              { day: '10/02 (수)', amount: 480, height: '76%' },
              { day: '10/03 (목)', amount: 520, height: '82%' },
              { day: '10/04 (금)', amount: 610, height: '96%' },
              { day: '10/05 (토)', amount: 430, height: '68%' },
              { day: '10/06 (오늘)', amount: 428, height: '67%', active: true },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {bar.amount}만
                </span>
                <div
                  className={`w-full max-w-[40px] transition-all duration-500 ${
                    bar.active ? 'bg-[#942537]' : 'bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] text-neutral-500 truncate w-full text-center">
                  {bar.day.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Distribution (Cols 5) */}
        <div className="lg:col-span-5 bg-neutral-950 p-6 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-bold text-xs uppercase text-neutral-300 tracking-wider">
              카테고리별 매출 비중
            </h3>
            <span className="text-[11px] text-neutral-500">당월 누적</span>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            {[
              { category: '여성 아우터 & 니트', percent: 42, color: 'bg-[#942537]' },
              { category: '남성 수트 & 코트', percent: 28, color: 'bg-neutral-300' },
              { category: '1+1 스페셜 기획전', percent: 18, color: 'bg-amber-500' },
              { category: '잡화 (가방/신발/주얼리)', percent: 8, color: 'bg-neutral-600' },
              { category: '키즈 의류', percent: 4, color: 'bg-neutral-700' },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>{cat.category}</span>
                  <span className="font-mono font-bold">{cat.percent}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Best Products Table */}
      <div className="bg-neutral-950 p-6 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-xs uppercase text-neutral-300 tracking-wider">
            실시간 판매 상위 베스트 상품
          </h3>
          <span className="text-[11px] text-neutral-500">누적 판매순</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">순위</th>
                <th className="py-2.5 px-3">상품명</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">판매가</th>
                <th className="py-2.5 px-3 text-right">누적 판매수</th>
                <th className="py-2.5 px-3 text-right">평점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-neutral-900/60">
                  <td className="py-3 px-3 text-center font-bold text-neutral-300">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                  <td className="py-3 px-3 font-mono text-neutral-400">{p.sku}</td>
                  <td className="py-3 px-3 font-mono text-neutral-200">{formatPrice(p.sale_price)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#f39c12]">
                    {p.sale_count}개
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-neutral-300">
                    ★ {p.rating_avg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
