import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types/board';
import { MessageSquare, Plus, Search, User, Clock, Eye, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="text-brand-500" size={32} />
            익명 게시판
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            프론트엔드에 관한 정보와 고민을 자유롭게 나누어 보세요.
          </p>
        </div>
        <Link
          to="/board/create"
          className="btn-primary shadow-lg shadow-brand-500/25 px-6 py-3"
        >
          <Plus size={18} />
          글쓰기
        </Link>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="제목, 내용, 작성자 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-brand-600 dark:text-brand-400">{filteredPosts.length}</span>
          개의 게시물
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-brand-500" size={40} />
          </div>
        ) : error ? (
          <div className="py-20 text-center card bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">게시글을 불러오지 못했습니다</h3>
            <p className="text-red-700 dark:text-red-500/80 mt-1">{error}</p>
            <button onClick={fetchPosts} className="mt-4 text-red-600 font-bold hover:underline">다시 시도</button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center card opacity-60">
            <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-300">게시글이 없습니다</h3>
            <p className="text-slate-500 dark:text-slate-500 mt-1">첫 번째 주인공이 되어보세요!</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/board/${post.id}`}
                className="block card-hover p-6 bg-white dark:bg-slate-900 group"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User size={12} />
                      </div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      조회 {post.views}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
