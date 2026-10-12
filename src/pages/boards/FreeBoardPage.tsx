import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Post } from '@/types/database.types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MessageSquare, ThumbsUp, Plus } from 'lucide-react';

export const FreeBoardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    api.getPosts('free').then(setPosts);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = await api.createPost({
      board_id: 'b-free',
      board_slug: 'free',
      user_id: user?.id,
      author_name: user?.name || '익명',
      title,
      content,
      is_private: false,
      status: 'pending',
    });

    setPosts([newPost, ...posts]);
    setShowModal(false);
    setTitle('');
    setContent('');
    showToast('게시글이 등록되었습니다.', 'success');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
        <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              자유 게시판 (COMMUNITY)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              패션 스타일링 팁, 착장 후기, 소소한 일상을 자유롭게 나누는 공간입니다.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors shrink-0"
          >
            글쓰기
          </button>
        </div>

        {/* Posts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="p-5 border border-neutral-200 hover:border-neutral-900 transition-all bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-bold text-neutral-700">{p.author_name}</span>
                <span>{p.created_at.split('T')[0]}</span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 hover:text-[#721b29] line-clamp-1">
                {p.title}
              </h3>
              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {p.content}
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> 댓글 {p.comments_count || 1}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> 추천 5
                  </span>
                </div>
                <span>조회수 {p.view_count || 120}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white max-w-lg w-full p-6 border border-neutral-200 shadow-2xl space-y-4 text-xs">
              <h3 className="font-serif text-lg font-bold">게시글 작성</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">제목</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">내용</label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="스타일링 팁 또는 공유하고 싶은 내용을 작성해 주세요."
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-neutral-300"
                  >
                    취소
                  </button>
                  <button type="submit" className="px-4 py-2 bg-neutral-900 text-white font-bold">
                    등록
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
