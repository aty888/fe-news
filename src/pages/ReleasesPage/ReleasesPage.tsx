// 릴리즈 노트 목록 페이지 — 히어로 배너 + 필터 + 무한스크롤
import InfiniteArticleList from '../../components/InfiniteArticleList/InfiniteArticleList';
import FilterBar from '../../components/FilterBar/FilterBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import type { Article } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { Rocket, Package, Star, Calendar } from 'lucide-react';

interface ReleasesPageProps {
  articles: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
}

export default function ReleasesPage({ articles, filter, setFilter, onToggleBookmark }: ReleasesPageProps) {
  const releases = articles.filter((a) => a.type === 'release');

  const thisMonth = releases.filter((a) => {
    const d = new Date(a.publishedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const sources = new Set(releases.map((a) => a.category)).size;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0d0d0d] border-b border-slate-200 dark:border-white/5">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          <div className="absolute -top-20 -left-10 w-[440px] h-[440px] rounded-full blur-3xl bg-violet-500/8 dark:bg-violet-500/12" />
          <div className="absolute -bottom-20 right-10 w-[360px] h-[360px] rounded-full blur-3xl bg-purple-500/8 dark:bg-purple-500/10" />
          <div className="absolute top-0 right-1/4 w-[250px] h-[200px] rounded-full blur-3xl bg-indigo-400/5 dark:bg-indigo-400/8" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-4">
                <Package size={11} />
                버전 트래킹
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
                릴리즈{' '}
                <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                  노트
                </span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-lg">
                프레임워크와 라이브러리의 주요 버전 업데이트를 놓치지 마세요.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 shrink-0 flex-wrap">
              {[
                { icon: Rocket,   label: '총 릴리즈',   value: releases.length },
                { icon: Star,     label: '카테고리',    value: sources },
                { icon: Calendar, label: '이번 달',     value: thisMonth },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 min-w-[80px] shadow-sm"
                >
                  <s.icon size={14} className="text-violet-500 mb-1" />
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
              <FilterBar filter={filter} setFilter={setFilter} totalCount={releases.length} />
            </div>
            <InfiniteArticleList articles={releases} onToggleBookmark={onToggleBookmark} />
          </div>
          <Sidebar articles={articles} />
        </div>
      </div>
    </div>
  );
}
