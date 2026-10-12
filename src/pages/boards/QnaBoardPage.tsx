import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Post } from '@/types/database.types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, MessageCircle, Plus, Search } from 'lucide-react';

export const QnaBoardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    api.getPosts('qna').then(setPosts);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = await api.createPost({
      board_id: 'b-qna',
      board_slug: 'qna',
      user_id: user?.id,
      author_name: user?.name || '고객',
      title,
      content,
      is_private: isPrivate,
      status: 'pending',
    });

    setPosts([newPost, ...posts]);
    setShowModal(false);
    setTitle('');
    setContent('');
    setIsPrivate(false);
    showToast('질문이 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.', 'success');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
        <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              질문과 답변 (Q&A)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              상품 및 서비스에 대한 문의사항을 남겨주시면 정성껏 답변해 드립니다.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors shrink-0"
          >
            질문 작성하기
          </button>
        </div>

        {/* Posts Table */}
        <div className="border border-neutral-200 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 w-16 text-center">번호</th>
                <th className="py-3 px-4">제목</th>
                <th className="py-3 px-4 w-24 text-center">작성자</th>
                <th className="py-3 px-4 w-28 text-center">작성일</th>
                <th className="py-3 px-4 w-20 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPost(selectedPost?.id === p.id ? null : p)}
                  className="hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 text-center text-neutral-400">{posts.length - idx}</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-900">
                    <div className="flex items-center gap-1.5">
                      {p.is_private && <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                      <span className="hover:text-[#721b29]">{p.title}</span>
                      {p.comments_count ? (
                        <span className="text-[#721b29] font-bold text-[10px]">
                          [{p.comments_count}]
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-neutral-600">{p.author_name}</td>
                  <td className="py-3.5 px-4 text-center text-neutral-400">
                    {p.created_at.split('T')[0]}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        p.status === 'answered'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {p.status === 'answered' ? '답변완료' : '접수대기'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Post Accordion Detail View */}
        {selectedPost && (
          <div className="p-6 bg-[#faf9f6] border border-neutral-300 text-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-bold text-sm text-neutral-900">{selectedPost.title}</h3>
              <span className="text-neutral-400">{selectedPost.created_at.split('T')[0]}</span>
            </div>
            <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
              {selectedPost.content}
            </p>
            <div className="p-4 bg-white border border-neutral-200 space-y-2">
              <span className="font-bold text-[#721b29] block">DASSOBA 공식 답변:</span>
              <p className="text-neutral-600 leading-relaxed">
                안녕하세요 고객님, 다써바를 이용해 주셔서 감사합니다.
                문의주신 제품의 경우 현재 2차 생산분 입고 준비 중이며, 차주 목요일 오후 재오픈될 예정입니다.
                추가 문의사항은 고객센터(1544-0000)로 연락 주시면 상세히 안내해 드리겠습니다.
              </p>
            </div>
          </div>
        )}

        {/* Write Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white max-w-lg w-full p-6 border border-neutral-200 shadow-2xl space-y-4 text-xs">
              <h3 className="font-serif text-lg font-bold">질문 작성하기</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">제목</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="질문 제목을 입력해 주세요"
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">내용</label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="상품명 또는 문의 내용을 상세히 적어주세요."
                    className="w-full p-2.5 border border-neutral-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="accent-neutral-900"
                    />
                    <span>비밀글로 등록 (작성자와 관리자만 확인 가능)</span>
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-neutral-300 font-semibold"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white font-bold"
                  >
                    등록하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
