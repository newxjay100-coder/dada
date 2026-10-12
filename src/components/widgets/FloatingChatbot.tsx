import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ChevronRight, CornerDownLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  quickActions?: string[];
  timestamp: string;
}

const INITIAL_QUICK_ACTIONS = [
  '주문조회',
  '배송조회',
  '취소/환불',
  '반품/교환',
  '포인트/쿠폰',
  '상품문의',
  '상담원 연결',
];

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '안녕하세요! 다써바(DASSOBA) 컨시어지 봇입니다.\n무엇을 도와드릴까요? 아래 버튼을 누르시거나 직접 질문해 주세요.',
      quickActions: INITIAL_QUICK_ACTIONS,
      timestamp: '방금 전',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: '방금 전',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate smart AI assistance / Edge function response
    setTimeout(() => {
      let botResponse = '';
      let nextActions: string[] = ['주문조회', '배송조회', '고객센터 가기'];

      const query = textToSend.toLowerCase();

      if (query.includes('주문') || query.includes('조회')) {
        botResponse = `${user ? user.name + '님의 ' : ''}최근 주문 내역은 [마이페이지 > 나의 주문 내역]에서 실시간으로 확인하실 수 있습니다.\n\n최근 주문 번호: ORD-20261005-94821 (배송중)`;
        nextActions = ['주문내역 바로가기', '배송조회', '주문취소 요청'];
      } else if (query.includes('배송')) {
        botResponse = 'DASSOBA는 오후 2시 이전 결제 건에 한하여 당일 출고 시스템을 운영하고 있습니다.\n50,000원 이상 구매 시 전 지역 무료 배송됩니다.';
        nextActions = ['주문내역 가기', '배송지 관리'];
      } else if (query.includes('반품') || query.includes('교환')) {
        botResponse = '상품 수령 후 7일 이내 [마이페이지 > 반품/교환 내역]에서 간편하게 접수하실 수 있습니다.\n단순 변심 시 왕복 택배비 6,000원이 발생합니다.';
        nextActions = ['반품/교환 접수', '1:1 문의'];
      } else if (query.includes('취소') || query.includes('환불')) {
        botResponse = '배송준비 전 단계인 결제완료 상태에서는 즉시 주문 취소가 가능합니다.\n출고 이후에는 반품 절차로 진행됩니다.';
        nextActions = ['주문내역 가기', '환불 규정 확인'];
      } else if (query.includes('포인트') || query.includes('쿠폰')) {
        botResponse = `현재 보유하신 혜택:\n• 적립금: ${user?.points_balance?.toLocaleString() || '14,500'}P\n• 사용 가능 쿠폰: 2장 (신규 10%, 무료배송)\n주문서 작성 시 동시 적용 가능합니다.`;
        nextActions = ['쿠폰함 가기', '포인트 내역', '상품 둘러보기'];
      } else if (query.includes('상담원')) {
        botResponse = '전문 상담원 상담 시간은 평일 09:00 - 18:00입니다.\n더 빠른 실시간 답변을 원하시면 카카오톡 채널을 이용해 주세요.';
        nextActions = ['카카오톡 상담', '1:1 문의 작성'];
      } else {
        botResponse = `"${textToSend}"에 대해 안내해 드립니다. 고객센터 FAQ 또는 마이페이지 메뉴를 통해 신속한 처리가 가능합니다. 추가로 알고 싶으신 내용을 선택해 주세요.`;
        nextActions = ['주문조회', '반품/교환', '고객센터 가기'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          quickActions: nextActions,
          timestamp: '방금 전',
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: string) => {
    if (action === '주문내역 바로가기' || action === '주문조회') {
      navigate('/mypage/orders');
      setIsOpen(false);
      return;
    }
    if (action === '쿠폰함 가기') {
      navigate('/mypage/coupons');
      setIsOpen(false);
      return;
    }
    if (action === '포인트 내역') {
      navigate('/mypage/points');
      setIsOpen(false);
      return;
    }
    if (action === '반품/교환 접수' || action === '반품/교환') {
      navigate('/mypage/claims');
      setIsOpen(false);
      return;
    }
    if (action === '1:1 문의 작성' || action === '1:1 문의') {
      navigate('/mypage/inquiries');
      setIsOpen(false);
      return;
    }
    if (action === '고객센터 가기') {
      navigate('/customer');
      setIsOpen(false);
      return;
    }

    handleSendMessage(action);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="DASSOBA 컨시어지 챗봇 열기"
        className="fixed bottom-20 md:bottom-8 right-20 md:right-24 z-40 w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <Bot className="w-5 h-5 text-neutral-100" />
        <span className="absolute right-14 bg-neutral-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          컨시어지 챗봇
        </span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-22 right-4 md:right-8 z-50 w-full max-w-sm bg-white border border-neutral-200 shadow-2xl flex flex-col h-[520px] max-h-[80vh] animate-slide-down">
          {/* Header */}
          <div className="bg-neutral-950 text-white p-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight">DASSOBA CONCIERGE</h4>
                <span className="text-[10px] text-neutral-400 block">
                  실시간 스마트 패션 어시스턴트
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-none'
                      : 'bg-white border border-neutral-200 text-neutral-800 shadow-xs'
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick Action Buttons */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {m.quickActions.map((qa) => (
                      <button
                        key={qa}
                        onClick={() => handleActionClick(qa)}
                        className="text-[11px] px-2.5 py-1 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-300 text-neutral-700 transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>{qa}</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[9px] text-neutral-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs p-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="궁금하신 내용을 입력해 주세요..."
              className="flex-1 text-xs py-2 px-3 border border-neutral-200 focus:outline-none focus:border-neutral-900"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
