import React, { useState } from 'react';
import { TaxDocument } from '@/types/database.types';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Printer, Download, FileSpreadsheet, ShieldAlert, CheckCircle } from 'lucide-react';

export const AdminTaxDocumentsPage: React.FC = () => {
  const { showToast } = useToast();

  const [documents, setDocuments] = useState<TaxDocument[]>([
    {
      id: 'tax-01',
      order_id: 'ord-01',
      document_type: 'tax_invoice',
      company_name: '(주)스타일랩코리아',
      business_registration_number: '120-87-54321',
      representative_name: '홍길동',
      supply_amount: 268182,
      tax_amount: 26818,
      total_amount: 295000,
      issue_status: 'issued',
      issue_date: '2026-10-03',
      created_at: '2026-10-02T13:50:00Z',
    },
    {
      id: 'tax-02',
      order_id: 'ord-02',
      document_type: 'cash_receipt',
      company_name: '개인 소득공제 (010-9876-5432)',
      business_registration_number: '010-9876-5432',
      representative_name: '김다써',
      supply_amount: 290909,
      tax_amount: 29091,
      total_amount: 320000,
      issue_status: 'requested',
      created_at: '2026-10-05T09:20:00Z',
    },
  ]);

  const handlePrint = (doc: TaxDocument) => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      '문서구분,주문번호,사업자/신청인,사업자번호,공급가액,부가세,합계금액,발행상태,발행일\n' +
      documents
        .map(
          (d) =>
            `${d.document_type},${d.order_id},${d.company_name},${d.business_registration_number},${d.supply_amount},${d.tax_amount},${d.total_amount},${d.issue_status},${d.issue_date || ''}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dassoba_tax_documents_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('세무 증빙 엑셀(CSV) 내보내기가 완료되었습니다.', 'success');
  };

  const handleApproveIssue = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              issue_status: 'issued',
              issue_date: new Date().toISOString().split('T')[0],
            }
          : d
      )
    );
    showToast('증빙 문서 발행 처리가 완료되었습니다.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">세무 증빙 관리 (TAX INVOICE & CASH RECEIPT)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            전자세금계산서 및 현금영수증 신청 내역 검수, 인쇄, PDF 출력 및 공인 중계 연동
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors border border-neutral-700"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> 엑셀/CSV 내보내기
        </button>
      </div>

      {/* Compliance Disclaimer Notice */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-neutral-200 block mb-0.5">국세청 전자세금계산서 연동 가이드</strong>
          현재 프로토타입 상태에서는 공인인증서 기반 중계사업자(팝빌, 바로빌 등) 연동 전 모의 발행 워크플로우로 동작합니다.
          실제 국세청 전송 법적 효력은 공인 API 인증 키 연결 후 활성화됩니다.
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">구분</th>
              <th className="py-3 px-4">신청 상호 / 수령인</th>
              <th className="py-3 px-4">사업자/식별번호</th>
              <th className="py-3 px-4 text-right">공급가액</th>
              <th className="py-3 px-4 text-right">세액 (10%)</th>
              <th className="py-3 px-4 text-right">합계 금액</th>
              <th className="py-3 px-4 text-center">발행 상태</th>
              <th className="py-3 px-4 text-center">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {documents.map((d) => (
              <tr key={d.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 font-bold text-neutral-300">
                  {d.document_type === 'tax_invoice' ? '전자세금계산서' : '현금영수증'}
                </td>
                <td className="py-3 px-4 font-medium text-white">{d.company_name}</td>
                <td className="py-3 px-4 font-mono text-neutral-300">
                  {d.business_registration_number}
                </td>
                <td className="py-3 px-4 text-right font-mono text-neutral-400">
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
                      onClick={() => handlePrint(d)}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="인쇄 및 PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
