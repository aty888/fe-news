// 뉴스 & 릴리즈 목록 페이지 — 히어로 배너 + 필터 + 무한스크롤
import InfiniteArticleList from '../../components/InfiniteArticleList/InfiniteArticleList';
import FilterBar from '../../components/FilterBar/FilterBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import type { Article } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { Newspaper, Zap, Globe, TrendingUp } from 'lucide-react';

interface NewsPageProps {
  articles: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
}

export default function NewsPage({ articles, filter, setFilter, onToggleBookmark }: NewsPageProps) {
  const news = articles;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0d0d0d] border-b border-slate-200 dark:border-white/5">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full blur-3xl bg-sky-500/8 dark:bg-sky-500/12" />
          <div className="absolute -bottom-16 right-0 w-[360px] h-[360px] rounded-full blur-3xl bg-cyan-500/8 dark:bg-cyan-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] rounded-full blur-3xl bg-blue-500/5 dark:bg-blue-500/8" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">
                <Zap size={11} />
                실시간 업데이트
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
                뉴스 &{' '}
                <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                  릴리즈
                </span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-lg">
                최신 프론트엔드 뉴스와 버전 릴리즈를 한곳에서 확인하세요.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 shrink-0 flex-wrap">
              {[
                { icon: Newspaper, label: '총 아티클', value: news.length },
                { icon: Globe,     label: '카테고리',  value: new Set(news.map((a) => a.category)).size },
                { icon: TrendingUp, label: '이번 주',  value: news.filter((a) => {
                  const d = new Date(a.publishedAt);
                  const now = new Date();
                  return (now.getTime() - d.getTime()) < 7 * 24 * 3600 * 1000;
                }).length },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 min-w-[80px] shadow-sm"
                >
                  <s.icon size={14} className="text-sky-500 mb-1" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    {s.value}
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="mb-6">
              <FilterBar filter={filter} setFilter={setFilter} totalCount={news.length} />
            </div>
            <InfiniteArticleList articles={news} onToggleBookmark={onToggleBookmark} />
          </div>
          <Sidebar articles={articles} />
        </div>
      </div>
    </div>
  );
}
