import React, { useState, useEffect } from 'react';
import { TaxDocument, Order, OrderItem } from '@/types/database.types';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import {
  Printer,
  FileSpreadsheet,
  ShieldAlert,
  CheckCircle,
  Plus,
  RefreshCw,
  Cloud,
  X,
  FileText,
  Building,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CalculatedItemRow {
  monthDay: string;
  itemName: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  supplyAmount: number;
  taxAmount: number;
  remark: string;
}

export const AdminTaxDocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Print & Preview Modal State
  const [selectedDoc, setSelectedDoc] = useState<TaxDocument | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [printCopyType, setPrintCopyType] = useState<'supplier' | 'buyer'>('buyer');

  // New Invoice Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');
  const [newDocType, setNewDocType] = useState<'tax_invoice' | 'cash_receipt'>('tax_invoice');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newBizNumber, setNewBizNumber] = useState('');
  const [newRepName, setNewRepName] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docs, ords] = await Promise.all([
        api.getTaxDocuments(),
        api.getOrders(),
      ]);
      setDocuments(docs);
      setOrders(ords);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute calculated line items from linked order
  const getCalculatedItems = (doc: TaxDocument, ord?: Order | null): CalculatedItemRow[] => {
    const targetOrder = ord || orders.find((o) => o.id === doc.order_id);
    const dateStr = doc.issue_date || doc.created_at || new Date().toISOString();
    const monthDay = dateStr.length >= 10 ? `${dateStr.substring(5, 7)}/${dateStr.substring(8, 10)}` : '10/12';

    if (targetOrder?.items && targetOrder.items.length > 0) {
      return targetOrder.items.map((it: OrderItem) => {
        const itemTotal = it.total_amount || it.unit_price * it.quantity;
        const supplyAmt = Math.round(itemTotal / 1.1);
        const taxAmt = itemTotal - supplyAmt;
        const unitSupply = Math.round(it.unit_price / 1.1);

        return {
          monthDay,
          itemName: it.product_name,
          spec: it.variant_info || '표준 규격 (FREE)',
          quantity: it.quantity,
          unitPrice: unitSupply,
          supplyAmount: supplyAmt,
          taxAmount: taxAmt,
          remark: it.is_one_plus_one ? '1+1 프로모션 행사' : '정상 출고',
        };
      });
    }

    // Fallback if no order items attached
    return [
      {
        monthDay,
        itemName: targetOrder?.order_name || 'DASSOBA 패션 의류 및 잡화',
        spec: '표준 규격',
        quantity: 1,
        unitPrice: doc.supply_amount,
        supplyAmount: doc.supply_amount,
        taxAmount: doc.tax_amount,
        remark: '온라인 주문 정산',
      },
    ];
  };

  const handleOpenPrintPreview = (doc: TaxDocument) => {
    const linked = orders.find((o) => o.id === doc.order_id) || null;
    setSelectedDoc(doc);
    setActiveOrder(linked);
  };

  const handleExecutePrint = () => {
    window.print();
  };

  const handleApproveIssue = async (id: string) => {
    await api.updateTaxDocumentStatus(id, 'issued');
    await loadData();
    showToast('증빙 문서가 국세청 전자세금계산서 표준에 맞춰 발행 승인되었습니다 (Supabase 저장).', 'success');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      '문서구분,주문번호,사업자/신청인,사업자번호,대표자,공급가액,부가세,합계금액,발행상태,발행일\n' +
      documents
        .map(
          (d) =>
            `${d.document_type},${d.order_id},${d.company_name},${d.business_registration_number},${d.representative_name},${d.supply_amount},${d.tax_amount},${d.total_amount},${d.issue_status},${d.issue_date || ''}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dassoba_tax_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('세무 증빙 엑셀(CSV) 내보내기가 완료되었습니다.', 'success');
  };

  const handleOpenNewInvoice = () => {
    if (orders.length > 0) {
      const first = orders[0];
      setNewOrderId(first.id);
      setNewCompanyName(first.buyer_name ? `(주)${first.buyer_name}컴퍼니` : '(주)스타일웨어');
      setNewBizNumber('128-86-90421');
      setNewRepName(first.buyer_name || '대표자');
    }
    setShowNewModal(true);
  };

  const handleCreateNewInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const ord = orders.find((o) => o.id === newOrderId);
    if (!ord) return;

    // Calculate supply amount & VAT directly from order
    const totalAmount = ord.final_payment_amount;
    const supplyAmount = Math.round(totalAmount / 1.1);
    const taxAmount = totalAmount - supplyAmount;

    const newDoc: TaxDocument = {
      id: `tax-${Date.now()}`,
      order_id: ord.id,
      document_type: newDocType,
      company_name: newCompanyName,
      business_registration_number: newBizNumber,
      representative_name: newRepName,
      supply_amount: supplyAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      issue_status: 'issued',
      issue_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    await api.saveTaxDocument(newDoc);
    await loadData();
    setShowNewModal(false);
    showToast('새 세금계산서가 발행되어 Supabase tax_documents 테이블에 저장되었습니다.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">세무 증빙 관리 (TAX INVOICE & CASH RECEIPT)</h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              <Cloud className="w-3 h-3" />
              {isSupabaseConfigured ? 'Supabase tax_documents 동기화' : '로컬 모의 저장소'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            주문 상품의 품목, 규격, 공급가액, 부가세를 Supabase 데이터 기반으로 자동 계산하여 정밀 세금명세서를 인쇄/출력합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> CSV 내보내기
          </button>
          <button
            onClick={handleOpenNewInvoice}
            className="px-4 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> 세금계산서 신규 발행
          </button>
        </div>
      </div>

      {/* Compliance Disclaimer Notice */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-neutral-200 block mb-0.5">국세청 전자세금계산서 표준 연동 규격 준수</strong>
          공급자(주식회사 다써바인터내셔널, 사업자번호 211-88-99432) 및 공급받는자의 사업자 정보, Supabase 저장 주문 품목별 공급가액(10/11)과 부가세(1/11)가 자동 산출되어 실시간 반영됩니다.
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">구분</th>
              <th className="py-3 px-4">주문번호</th>
              <th className="py-3 px-4">신청 상호 / 수령인</th>
              <th className="py-3 px-4">사업자/식별번호</th>
              <th className="py-3 px-4 text-right">공급가액 (단가x수량)</th>
              <th className="py-3 px-4 text-right">세액 (VAT 10%)</th>
              <th className="py-3 px-4 text-right">합계 금액</th>
              <th className="py-3 px-4 text-center">발행 상태</th>
              <th className="py-3 px-4 text-center">세금명세서 출력</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 font-bold text-neutral-300">
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-mono ${
                      d.document_type === 'tax_invoice'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                    }`}
                  >
                    {d.document_type === 'tax_invoice' ? '전자세금계산서' : '현금영수증'}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-400">
                  {d.order_id}
                </td>
                <td className="py-3 px-4 font-medium text-white">{d.company_name}</td>
                <td className="py-3 px-4 font-mono text-neutral-300">
                  {d.business_registration_number}
                </td>
                <td className="py-3 px-4 text-right font-mono text-neutral-300">
                  {formatPrice(d.supply_amount)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-neutral-400">
                  {formatPrice(d.tax_amount)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {formatPrice(d.total_amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      d.issue_status === 'issued'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {d.issue_status === 'issued' ? '발행완료' : '발행요청'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {d.issue_status === 'requested' && (
                      <button
                        onClick={() => handleApproveIssue(d.id)}
                        className="px-2 py-1 bg-[#721b29] hover:bg-[#8e2233] text-white text-[11px] font-bold"
                      >
                        승인발행
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenPrintPreview(d)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-mono text-xs flex items-center gap-1 border border-neutral-700 transition-colors"
                      title="세금명세서 인쇄 및 PDF 출력"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      명세서 출력
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================================= */}
      {/* 1. 세금명세서 / 전자세금계산서 인쇄 출력 모달 (Print Preview Modal) */}
      {/* ================================================================= */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
          <div className="bg-white text-neutral-900 rounded-lg max-w-4xl w-full my-8 p-6 shadow-2xl relative">
            {/* Top Toolbar (Hidden on print) */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-300 gap-3 print:hidden">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-neutral-800">보관용 구분:</span>
                <div className="inline-flex rounded-md border border-neutral-300 p-0.5 bg-neutral-100 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPrintCopyType('buyer')}
                    className={`px-3 py-1 rounded transition-colors ${
                      printCopyType === 'buyer'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    공급받는자 보관용 (청색)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintCopyType('supplier')}
                    className={`px-3 py-1 rounded transition-colors ${
                      printCopyType === 'supplier'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    공급자 보관용 (적색)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExecutePrint}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 rounded transition-all shadow-md"
                >
                  <Printer className="w-4 h-4 text-cyan-300" /> 🖨️ 인쇄하기 / PDF 저장
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Section (Standard Korean Tax Invoice Layout) */}
            <div id="tax-invoice-printable" className="mt-4 p-4 text-xs font-sans">
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #tax-invoice-printable, #tax-invoice-printable * {
                    visibility: visible !important;
                  }
                  #tax-invoice-printable {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 10mm !important;
                    background: white !important;
                    color: black !important;
                  }
                }
              `}</style>

              {/* Title & Document Info */}
              <div
                className={`border-2 p-3 mb-3 flex items-center justify-between ${
                  printCopyType === 'buyer'
                    ? 'border-blue-600 text-blue-900 bg-blue-50/30'
                    : 'border-red-600 text-red-900 bg-red-50/30'
                }`}
              >
                <div>
                  <h2 className="text-xl font-bold tracking-widest font-serif">
                    {selectedDoc.document_type === 'tax_invoice'
                      ? '전 자 세 금 계 산 서 (세금명세서)'
                      : '현 금 영 수 증 (세무증빙명세서)'}
                  </h2>
                  <span className="text-[11px] font-semibold mt-0.5 block">
                    ({printCopyType === 'buyer' ? '공급받는자 보관용' : '공급자 보관용'})
                  </span>
                </div>
                <div className="text-right text-[11px] font-mono leading-tight">
                  <div>승인번호: {selectedDoc.id.toUpperCase()}-202610</div>
                  <div>발행일자: {selectedDoc.issue_date || selectedDoc.created_at.substring(0, 10)}</div>
                  <div className="text-neutral-500">주문참조: {selectedDoc.order_id}</div>
                </div>
              </div>

              {/* Supplier & Buyer Tables Side by Side */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* 1. Supplier Box (공급자) */}
                <table className="w-full border border-neutral-400 text-[11px] border-collapse">
                  <tbody>
                    <tr>
                      <td rowSpan={4} className="w-7 bg-neutral-100 font-bold text-center border-r border-b border-neutral-400 p-1">
                        공<br />급<br />자
                      </td>
                      <td className="w-20 bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        등록번호
                      </td>
                      <td colSpan={3} className="p-1.5 border-b border-neutral-400 font-bold font-mono">
                        211-88-99432
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        상호(법인명)
                      </td>
                      <td className="p-1.5 border-r border-b border-neutral-400 font-bold">
                        (주)다써바인터내셔널
                      </td>
                      <td className="w-12 bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400 text-center">
                        성명
                      </td>
                      <td className="p-1.5 border-b border-neutral-400">
                        김다써 (인)
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        사업장 주소
                      </td>
                      <td colSpan={3} className="p-1.5 border-b border-neutral-400 text-[10px]">
                        서울특별시 성동구 연무장길 2077 다써바타워 8층
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-neutral-400">
                        업태 / 종목
                      </td>
                      <td colSpan={3} className="p-1.5 text-[10px]">
                        도소매 및 전자상거래 / 의류 및 패션잡화
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 2. Buyer Box (공급받는자) */}
                <table className="w-full border border-neutral-400 text-[11px] border-collapse">
                  <tbody>
                    <tr>
                      <td rowSpan={4} className="w-7 bg-neutral-100 font-bold text-center border-r border-b border-neutral-400 p-1">
                        공급<br />받는자
                      </td>
                      <td className="w-20 bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        등록번호
                      </td>
                      <td colSpan={3} className="p-1.5 border-b border-neutral-400 font-bold font-mono">
                        {selectedDoc.business_registration_number || '개인 소득공제'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        상호(성명)
                      </td>
                      <td className="p-1.5 border-r border-b border-neutral-400 font-bold">
                        {selectedDoc.company_name}
                      </td>
                      <td className="w-12 bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400 text-center">
                        성명
                      </td>
                      <td className="p-1.5 border-b border-neutral-400">
                        {selectedDoc.representative_name || activeOrder?.buyer_name || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-b border-neutral-400">
                        사업장 주소
                      </td>
                      <td colSpan={3} className="p-1.5 border-b border-neutral-400 text-[10px]">
                        {activeOrder?.address_line1
                          ? `${activeOrder.address_line1} ${activeOrder.address_line2 || ''}`
                          : '고객 등록 배송지 주소'}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100 font-semibold p-1.5 border-r border-neutral-400">
                        이메일 / 연락처
                      </td>
                      <td colSpan={3} className="p-1.5 text-[10px] font-mono">
                        {activeOrder?.buyer_email || 'tax@customer.kr'} / {activeOrder?.buyer_phone || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Strip */}
              <table className="w-full border border-neutral-400 text-center text-[11px] mb-3 border-collapse">
                <thead className="bg-neutral-100 font-bold">
                  <tr>
                    <th className="border border-neutral-400 p-1.5">작성일자</th>
                    <th className="border border-neutral-400 p-1.5">공급가액 (단가x수량)</th>
                    <th className="border border-neutral-400 p-1.5">세액 (부가세 10%)</th>
                    <th className="border border-neutral-400 p-1.5">합계 금액 (총액)</th>
                    <th className="border border-neutral-400 p-1.5">비고</th>
                  </tr>
                </thead>
                <tbody className="font-mono font-bold">
                  <tr>
                    <td className="border border-neutral-400 p-1.5">
                      {selectedDoc.issue_date || selectedDoc.created_at.substring(0, 10)}
                    </td>
                    <td className="border border-neutral-400 p-1.5 text-right pr-3">
                      {formatPrice(selectedDoc.supply_amount)}
                    </td>
                    <td className="border border-neutral-400 p-1.5 text-right pr-3 text-neutral-700">
                      {formatPrice(selectedDoc.tax_amount)}
                    </td>
                    <td className="border border-neutral-400 p-1.5 text-right pr-3 text-base font-black text-black">
                      {formatPrice(selectedDoc.total_amount)}
                    </td>
                    <td className="border border-neutral-400 p-1.5 font-sans font-normal text-[10px]">
                      영수(카드/간편결제 완료)
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Items Breakdown Table (Supabase Data-driven Calculation) */}
              <div className="mb-3">
                <div className="font-bold text-xs mb-1 text-neutral-800 flex items-center justify-between">
                  <span>품목별 거래 명세 (Supabase 주문 품목 및 규격 실시간 연동)</span>
                  <span className="text-[10px] text-neutral-500 font-normal">단위: 원 (KRW)</span>
                </div>
                <table className="w-full border border-neutral-400 text-[11px] text-center border-collapse">
                  <thead className="bg-neutral-100 font-semibold">
                    <tr>
                      <th className="border border-neutral-400 p-1.5 w-14">월 / 일</th>
                      <th className="border border-neutral-400 p-1.5 text-left pl-3">품목 (상품명)</th>
                      <th className="border border-neutral-400 p-1.5 w-32">규격 (옵션/사이즈)</th>
                      <th className="border border-neutral-400 p-1.5 w-14">수량</th>
                      <th className="border border-neutral-400 p-1.5 w-24 text-right pr-2">단가(공급가)</th>
                      <th className="border border-neutral-400 p-1.5 w-24 text-right pr-2">공급가액</th>
                      <th className="border border-neutral-400 p-1.5 w-20 text-right pr-2">세액</th>
                      <th className="border border-neutral-400 p-1.5 w-24">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCalculatedItems(selectedDoc, activeOrder).map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="border border-neutral-400 p-1.5 font-mono">{row.monthDay}</td>
                        <td className="border border-neutral-400 p-1.5 text-left pl-3 font-medium text-black">
                          {row.itemName}
                        </td>
                        <td className="border border-neutral-400 p-1.5 font-mono text-[10px] text-neutral-600">
                          {row.spec}
                        </td>
                        <td className="border border-neutral-400 p-1.5 font-mono font-bold">{row.quantity}</td>
                        <td className="border border-neutral-400 p-1.5 font-mono text-right pr-2">
                          {formatPrice(row.unitPrice)}
                        </td>
                        <td className="border border-neutral-400 p-1.5 font-mono text-right pr-2 font-bold">
                          {formatPrice(row.supplyAmount)}
                        </td>
                        <td className="border border-neutral-400 p-1.5 font-mono text-right pr-2 text-neutral-600">
                          {formatPrice(row.taxAmount)}
                        </td>
                        <td className="border border-neutral-400 p-1.5 text-[10px] text-neutral-500">
                          {row.remark}
                        </td>
                      </tr>
                    ))}
                    {/* Empty padding rows to look like real Korean tax form */}
                    {Array.from({ length: Math.max(0, 4 - getCalculatedItems(selectedDoc, activeOrder).length) }).map(
                      (_, i) => (
                        <tr key={`empty-${i}`}>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                          <td className="border border-neutral-400 p-1.5">&nbsp;</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Settlement Summary */}
              <div className="border border-neutral-400 p-3 bg-neutral-50 flex items-center justify-between text-xs">
                <div className="space-x-4">
                  <span>
                    <strong>합계금액:</strong> <span className="font-mono font-bold text-sm text-black">{formatPrice(selectedDoc.total_amount)}</span>원
                  </span>
                  <span className="text-neutral-500">
                    (공급가액: {formatPrice(selectedDoc.supply_amount)}원 / 부가세: {formatPrice(selectedDoc.tax_amount)}원)
                  </span>
                </div>
                <div className="font-bold text-neutral-800">
                  위 금액을 정히 <span className="underline decoration-2 text-blue-700">영수</span> 함.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. 신규 세금계산서 수동 발행 모달 (New Invoice Modal) */}
      {/* ================================================================= */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-lg w-full space-y-4 text-xs text-neutral-300">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-400" />
                주문 기반 세금계산서 / 명세서 신규 발행
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="space-y-3.5">
              <div>
                <label className="block text-neutral-400 mb-1">발행 대상 주문 선택 (Supabase 실시간 주문)</label>
                <select
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  required
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      [{o.order_number}] {o.buyer_name} - {formatPrice(o.final_payment_amount)}원 ({o.order_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">증빙 구분</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDocType('tax_invoice')}
                    className={`p-2 border text-center font-bold transition-colors ${
                      newDocType === 'tax_invoice'
                        ? 'bg-[#721b29] border-[#942537] text-white'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    전자세금계산서 (사업자용)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDocType('cash_receipt')}
                    className={`p-2 border text-center font-bold transition-colors ${
                      newDocType === 'cash_receipt'
                        ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    현금영수증 (소득공제/지출증빙)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">상호(법인명 / 개인명)</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">사업자등록번호 / 주민(휴대폰)번호</label>
                <input
                  type="text"
                  required
                  value={newBizNumber}
                  onChange={(e) => setNewBizNumber(e.target.value)}
                  placeholder="예: 128-86-90421 또는 010-1234-5678"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">대표자 성명</label>
                <input
                  type="text"
                  required
                  value={newRepName}
                  onChange={(e) => setNewRepName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-2 border border-neutral-700 text-neutral-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold transition-colors"
                >
                  즉시 발행 및 Supabase 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
