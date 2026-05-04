import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types/board';
import { ArrowLeft, User, Clock, Eye, Edit3, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
    incrementViews();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err: any) {
      console.error('Error fetching post:', err);
      setError('게시글을 불러올 수 없거나 삭제되었습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment_views', { post_id: id });
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  const handleDelete = async () => {
    const password = prompt('비밀번호를 입력하세요:');
    if (!password) return;

    if (post?.password !== password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/board');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{error}</h2>
        <Link to="/board" className="mt-6 inline-flex items-center gap-2 text-brand-600 font-bold hover:underline">
          <ArrowLeft size={20} /> 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate('/board')}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        목록으로
      </button>

      <article className="card p-8 md:p-10 bg-white dark:bg-slate-900 shadow-xl border-slate-200/60 dark:border-slate-800">
        <header className="mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <User size={16} />
                </div>
                <span className="font-bold">{post.author}</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                {format(new Date(post.created_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
              </div>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                조회 {post.views}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/board/edit/${post.id}`}
                className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-all"
                title="수정"
              >
                <Edit3 size={20} />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                title="삭제"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
            {post.content}
          </p>
        </div>
      </article>
    </div>
  );
}
