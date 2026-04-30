import { ArrowRight, Zap, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import FilterBar from '../../components/FilterBar/FilterBar';
import type { FilterState } from '../../hooks/useArticles';
import type { Article } from '../../types';

interface HomePageProps {
  articles: Article[];
  featured: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
  isLoading?: boolean;
}

const stats = [
  { icon: <Zap size={18} className="text-brand-500" />, label: '매주 업데이트', value: '50+' },
  { icon: <TrendingUp size={18} className="text-success-500" />, label: '카테고리', value: '10' },
  { icon: <BookOpen size={18} className="text-accent-500" />, label: '총 기사 수', value: '500+' },
];

export default function HomePage({ articles, featured, filter, setFilter, onToggleBookmark, isLoading }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl dark:bg-brand-500/5" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl dark:bg-accent-500/5" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
              매일 업데이트되는 프론트엔드 뉴스
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance animate-slide-up">
              프론트엔드 트렌드,
              <br />
              <span className="gradient-text">한눈에 파악하세요</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 text-balance animate-slide-up">
              React, TypeScript, CSS, 빌드 도구 등 최신 프론트엔드 생태계의
              뉴스, 튜토리얼, 릴리즈 노트를 큐레이션합니다.
            </p>
            <div className="flex items-center justify-center gap-3 animate-fade-in">
              <Link to="/news" className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-500/25">
                최신 뉴스 보기
                <ArrowRight size={18} />
              </Link>
              <Link to="/tutorials" className="btn-ghost px-6 py-3 text-base">
                튜토리얼 탐색
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 text-center">
                {s.icon}
                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Featured Articles */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp size={22} className="text-brand-500" />
                주목할 기사
              </h2>
              <Link to="/news" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                모두 보기 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={{ ...article, isBookmarked: false }}
                  onToggleBookmark={onToggleBookmark}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {/* Main content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="mb-6">
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                totalCount={articles.length}
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card p-5 animate-pulse min-h-[200px] flex flex-col">
                    <div className="flex gap-2 mb-3">
                      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    </div>
                    <div className="w-full h-6 bg-slate-200 dark:bg-slate-700 rounded mt-2 mb-4" />
                    <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                    <div className="w-full h-16 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {articles.slice(0, 10).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onToggleBookmark={onToggleBookmark}
                    />
                  ))}
                </div>
                {articles.length > 10 && (
                  <div className="mt-8 text-center">
                    <Link to="/news" className="btn-ghost inline-flex items-center gap-2">
                      더 많은 기사 보기 <ArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="card py-20 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  결과가 없습니다
                </h3>
                <p className="text-sm text-slate-400">
                  다른 검색어나 필터를 사용해보세요
                </p>
              </div>
            )}
          </div>

          <Sidebar articles={articles} />
        </div>
      </div>
    </div>
  );
}
