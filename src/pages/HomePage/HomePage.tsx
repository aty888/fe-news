// 메인 홈 페이지 — 화려한 히어로 비주얼 + 피처드 아티클 + 필터 목록
import {
  ArrowRight, Zap, TrendingUp, BookOpen, Sparkles,
  Atom, Code2, Globe, Wind, LayoutGrid, Triangle, Package,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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

interface TechPill {
  label: string;
  icon: LucideIcon;
  color: string;
  delay: string;
}

const LEFT_PILLS: TechPill[] = [
  { label: 'React 19',   icon: Atom,       color: 'bg-sky-500/10     text-sky-600     dark:text-sky-400     border-sky-500/25',     delay: '0s'   },
  { label: 'Next.js 15', icon: Globe,      color: 'bg-slate-500/10   text-slate-600   dark:text-slate-300   border-slate-500/20',   delay: '0.8s' },
  { label: 'Bun 1.2',    icon: Package,    color: 'bg-amber-500/10   text-amber-600   dark:text-amber-400   border-amber-500/25',   delay: '1.6s' },
  { label: 'CSS Grid',   icon: LayoutGrid, color: 'bg-orange-500/10  text-orange-600  dark:text-orange-400  border-orange-500/20',  delay: '2.4s' },
];

const RIGHT_PILLS: TechPill[] = [
  { label: 'TypeScript 5.5', icon: Code2,    color: 'bg-blue-500/10    text-blue-600    dark:text-blue-400    border-blue-500/25',    delay: '0.4s' },
  { label: 'Vite 6',         icon: Zap,      color: 'bg-purple-500/10  text-purple-600  dark:text-purple-400  border-purple-500/20',  delay: '1.2s' },
  { label: 'Tailwind v4',    icon: Wind,     color: 'bg-teal-500/10    text-teal-600    dark:text-teal-400    border-teal-500/20',    delay: '2s'   },
  { label: 'Vue 3.5',        icon: Triangle, color: 'bg-green-500/10   text-green-600   dark:text-green-400   border-green-500/20',   delay: '2.8s' },
];

// 각 뱃지의 애니메이션을 CSS 변수로 다양하게 분리
const FLOAT_VARIANTS = [
  'badge-float-a',
  'badge-float-b',
  'badge-float-c',
  'badge-float-d',
];

function BadgePill({ pill, side, index }: { pill: TechPill; side: 'left' | 'right'; index: number }) {
  const variant = FLOAT_VARIANTS[index % FLOAT_VARIANTS.length];
  const Icon = pill.icon;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold backdrop-blur-sm shadow-sm cursor-default select-none ${pill.color} ${variant} ${side === 'left' ? 'self-end' : 'self-start'}`}
      style={{ animationDelay: pill.delay }}
    >
      <Icon size={12} />
      {pill.label}
    </div>
  );
}

const stats = [
  { icon: Zap,        color: 'text-brand-500',   label: '매주 업데이트', value: '50+'  },
  { icon: TrendingUp, color: 'text-success-500',  label: '카테고리',     value: '10'   },
  { icon: BookOpen,   color: 'text-accent-500',   label: '총 기사 수',   value: '500+' },
];

const STAT_BG = [
  'bg-brand-500/10 dark:bg-brand-500/15',
  'bg-success-500/10 dark:bg-success-500/15',
  'bg-accent-500/10 dark:bg-accent-500/15',
];

export default function HomePage({ articles, featured, filter, setFilter, onToggleBookmark, isLoading }: HomePageProps) {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28 bg-white dark:bg-[#0d0d0d]">

        {/* 배경 이미지 패턴 */}
        <div className="hero-pattern absolute inset-0 -z-10 pointer-events-none" />

        {/* 그라디언트 블롭 — 패턴 위에 부드럽게 덮음 */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl bg-brand-500/12 dark:bg-brand-500/16 animate-drift pointer-events-none" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl bg-accent-500/8 dark:bg-accent-500/12 animate-drift pointer-events-none" style={{ animationDelay: '5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[200px] rounded-full blur-3xl bg-violet-500/6 dark:bg-violet-500/10 animate-glow pointer-events-none" />

        {/* 3컬럼 레이아웃: 왼쪽 뱃지 | 센터 | 오른쪽 뱃지 */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[220px_1fr_220px] items-center gap-6">

            {/* 왼쪽 뱃지 컬럼 */}
            <div className="hidden lg:flex flex-col gap-3 items-end">
              {LEFT_PILLS.map((pill, i) => (
                <BadgePill key={pill.label} pill={pill} side="left" index={i} />
              ))}
            </div>

            {/* 센터 콘텐츠 */}
            <div className="text-center py-4">
              {/* 상단 배지 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-7 animate-fade-in shadow-sm shadow-brand-500/10">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
                매일 업데이트되는 프론트엔드 뉴스
                <Sparkles size={13} className="opacity-70" />
              </div>

              {/* 타이틀 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-5 leading-tight animate-slide-up">
                프론트엔드 트렌드,
                <br />
                <span className="shimmer-text">한눈에 파악하세요</span>
              </h1>

              {/* 서브타이틀 */}
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-9 text-balance max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                React, TypeScript, CSS, 빌드 도구 등<br className="hidden sm:block" />
                최신 프론트엔드 생태계의 뉴스와 튜토리얼을 큐레이션합니다.
              </p>

              {/* CTA */}
              <div className="flex items-center justify-center gap-3 mb-12 flex-wrap animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link to="/news" className="btn-primary px-7 py-3.5 text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200">
                  최신 뉴스 보기
                  <ArrowRight size={18} />
                </Link>
                <Link to="/tutorials" className="btn-ghost px-7 py-3.5 text-base border border-slate-200 dark:border-white/10 hover:-translate-y-0.5 transition-all duration-200">
                  튜토리얼 탐색
                </Link>
              </div>

              {/* 통계 */}
              <div className="flex items-center justify-center gap-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {stats.map((s, i) => (
                  <div key={s.label} className="flex flex-col items-center gap-1.5 group">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${STAT_BG[i]} mb-1 group-hover:scale-110 transition-transform duration-200`}>
                      <s.icon size={18} className={s.color} />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none tabular-nums">{s.value}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* 모바일용 뱃지 (인라인) */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 lg:hidden">
                {[...LEFT_PILLS, ...RIGHT_PILLS].map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <span key={pill.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${pill.color}`}>
                      <Icon size={11} />
                      {pill.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽 뱃지 컬럼 */}
            <div className="hidden lg:flex flex-col gap-3 items-start">
              {RIGHT_PILLS.map((pill, i) => (
                <BadgePill key={pill.label} pill={pill} side="right" index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 메인 콘텐츠 ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-12">

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
                <ArticleCard key={article.id} article={{ ...article, isBookmarked: false }} onToggleBookmark={onToggleBookmark} featured />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="mb-6">
              <FilterBar filter={filter} setFilter={setFilter} totalCount={articles.length} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
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
                    <ArticleCard key={article.id} article={article} onToggleBookmark={onToggleBookmark} />
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
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">결과가 없습니다</h3>
                <p className="text-sm text-slate-400">다른 검색어나 필터를 사용해보세요</p>
              </div>
            )}
          </div>

          <Sidebar articles={articles} />
        </div>
      </div>
    </div>
  );
}
