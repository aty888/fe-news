import { useEffect, useRef, useState } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { articles } from '../../data/articles';
import { categoryColors } from '../../data/articles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = ['React 19', 'CSS Container', 'TypeScript 5.5', 'Vite'];
const trending = ['Signals', 'Module Federation', 'Web Workers', 'Bun'];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 1
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) onClose(); // toggled externally
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl card shadow-2xl animate-slide-up overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="기사, 태그, 작성자 검색..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                검색 결과
              </div>
              {filtered.map((article) => (
                <button
                  key={article.id}
                  onClick={onClose}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {article.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`tag text-xs ${categoryColors[article.category]}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400">{article.readTime}분 읽기</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="py-12 text-center text-slate-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">"{query}"에 대한 결과가 없습니다</p>
            </div>
          ) : (
            <div className="py-4">
              {/* Recent */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <Clock size={12} />
                  최근 검색
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Trending */}
              <div className="px-4 py-2 mt-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <TrendingUp size={12} />
                  트렌딩 태그
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                    >
                      #{s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
