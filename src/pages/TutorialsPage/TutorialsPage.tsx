// 튜토리얼 & 팁 목록 페이지 — 히어로 배너 + 필터 + 무한스크롤
import InfiniteArticleList from '../../components/InfiniteArticleList/InfiniteArticleList';
import FilterBar from '../../components/FilterBar/FilterBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import type { Article } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { BookOpen, Lightbulb, GraduationCap, Clock } from 'lucide-react';

interface TutorialsPageProps {
  articles: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
}

export default function TutorialsPage({ articles, filter, setFilter, onToggleBookmark }: TutorialsPageProps) {
  const tutorials = articles.filter((a) => a.type === 'tutorial' || a.type === 'tip');

  const avgReadTime = tutorials.length > 0
    ? Math.round(tutorials.reduce((acc, a) => acc + a.readTime, 0) / tutorials.length)
    : 0;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white dark:bg-[#0d0d0d] border-b border-slate-200 dark:border-white/5">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none -z-0">
          <div className="absolute -top-24 -left-16 w-[420px] h-[420px] rounded-full blur-3xl bg-emerald-500/8 dark:bg-emerald-500/12" />
          <div className="absolute -bottom-20 right-0 w-[380px] h-[380px] rounded-full blur-3xl bg-teal-500/8 dark:bg-teal-500/10" />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[150px] rounded-full blur-3xl bg-green-400/5 dark:bg-green-400/8" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
                <Lightbulb size={11} />
                학습 & 성장
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
                튜토리얼 &{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  팁
                </span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-lg">
                실무에서 바로 쓸 수 있는 튜토리얼과 개발 팁을 모았습니다.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 shrink-0 flex-wrap">
              {[
                { icon: BookOpen,       label: '총 아티클',   value: tutorials.length },
                { icon: GraduationCap,  label: '튜토리얼',    value: tutorials.filter((a) => a.type === 'tutorial').length },
                { icon: Clock,          label: '평균 읽기',   value: `${avgReadTime}분` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 min-w-[80px] shadow-sm"
                >
                  <s.icon size={14} className="text-emerald-500 mb-1" />
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
              <FilterBar filter={filter} setFilter={setFilter} totalCount={tutorials.length} />
            </div>
            <InfiniteArticleList articles={tutorials} onToggleBookmark={onToggleBookmark} />
          </div>
          <Sidebar articles={articles} />
        </div>
      </div>
    </div>
  );
}
