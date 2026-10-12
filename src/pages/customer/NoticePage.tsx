import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Post } from '@/types/database.types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<Post[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api.getPosts('notice').then(setNotices);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            공지사항
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            DASSOBA의 주요 공지 및 운영 정책 변경 안내입니다.
          </p>
        </div>

        <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs">
          {notices.map((n) => {
            const isExpanded = expandedId === n.id;
            return (
              <div key={n.id} className="bg-white">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : n.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] font-bold text-[#721b29] uppercase">NOTICE</span>
                    <h3 className="font-bold text-sm text-neutral-900">{n.title}</h3>
                    <span className="text-neutral-400 text-[11px] block">
                      {n.created_at.split('T')[0]}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-5 bg-neutral-50 text-neutral-700 leading-relaxed border-t border-neutral-100 whitespace-pre-wrap">
                    {n.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<Post[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api.getPosts('faq').then(setFaqs);
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            고객님들께서 가장 많이 문의하시는 질문을 모았습니다.
          </p>
        </div>

        <div className="border border-neutral-200 divide-y divide-neutral-200 text-xs">
          {faqs.map((f) => {
            const isExpanded = expandedId === f.id;
            return (
              <div key={f.id} className="bg-white">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Q. FAQ</span>
                    <h3 className="font-bold text-sm text-neutral-900">{f.title}</h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-5 bg-neutral-50 text-neutral-700 leading-relaxed border-t border-neutral-100 whitespace-pre-wrap">
                    <span className="font-bold text-neutral-900 block mb-1">A. 답변:</span>
                    {f.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
