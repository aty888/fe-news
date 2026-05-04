import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, User, Lock, Type, AlignLeft } from 'lucide-react';

export default function BoardFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(() => localStorage.getItem('board_author') || '');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTitle(data.title);
      setContent(data.content);
      setAuthor(data.author);
    } catch (err) {
      console.error('Error fetching post:', err);
      alert('게시글을 불러올 수 없습니다.');
      navigate('/board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim() || !password.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem('board_author', author);

    try {
      if (isEdit) {
        // Simple password check (in a real app, this should be handled server-side)
        const { data: original } = await supabase
          .from('posts')
          .select('password')
          .eq('id', id)
          .single();
        
        if (original?.password !== password) {
          alert('비밀번호가 일치하지 않습니다.');
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase
          .from('posts')
          .update({ title, content, author })
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([{ title, content, author, password, views: 0 }]);
        
        if (error) throw error;
      }
      navigate('/board');
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        뒤로 가기
      </button>

      <div className="card p-8 bg-white dark:bg-slate-900 shadow-xl border-slate-200/60 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          {isEdit ? '게시글 수정' : '새 게시글 작성'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User size={16} /> 작성자
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="닉네임"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock size={16} /> 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="수정/삭제 시 필요"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Type size={16} /> 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <AlignLeft size={16} /> 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="자유롭게 내용을 작성해주세요..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 rounded-xl text-base shadow-lg shadow-brand-500/20 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {isEdit ? '수정 완료' : '게시글 등록'}
          </button>
        </form>
      </div>
    </div>
  );
}
