import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { Category, ContentType } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { categoryColors } from '../../data/articles';

const CATEGORIES: Array<Category | 'All'> = [
  'All',
  'JavaScript',
  'TypeScript',
  'Frameworks',
  'Styling',
  'Web/Browser',
  'Performance',
  'Architecture',
  'Tooling',
  'AI/Trends',
  'Career',
];

const TYPES: Array<{ value: ContentType | 'All'; label: string; icon: string }> = [
  { value: 'All', label: '전체', icon: '📋' },
  { value: 'news', label: '뉴스', icon: '📰' },
  { value: 'tutorial', label: '튜토리얼', icon: '📚' },
  { value: 'release', label: '릴리즈', icon: '🚀' },
  { value: 'tip', label: '팁', icon: '💡' },
  { value: 'discussion', label: '토론', icon: '💬' },
];

interface FilterBarProps {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  totalCount: number;
}

export default function FilterBar({ filter, setFilter, totalCount }: FilterBarProps) {
  const update = (partial: Partial<FilterState>) =>
    setFilter({ ...filter, ...partial });

  return (
    <div className="space-y-4">
      {/* Search + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="기사 검색..."
            className="input-base pl-9 pr-9"
          />
          {filter.search && (
            <button
              onClick={() => update({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <SlidersHorizontal size={14} />
          <span>{totalCount}개 기사</span>
        </div>
        <button
          onClick={() => update({ bookmarked: !filter.bookmarked })}
          className={`btn-ghost text-sm ${filter.bookmarked ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10' : ''}`}
        >
          🔖 북마크
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => update({ category: cat })}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter.category === cat
                ? cat === 'All'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : `bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900`
                : cat === 'All'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                : `${categoryColors[cat]} hover:opacity-80`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => update({ type: t.value })}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
              filter.type === t.value
                ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
