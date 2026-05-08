import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category, ContentType } from "../../types";
import type { FilterState } from "../../hooks/useArticles";
import { categoryColors } from "../../data/articles";

const CATEGORIES: Array<Category | "All"> = [
  "All",
  "JavaScript",
  "TypeScript",
  "Frameworks",
  "Styling",
  "Web/Browser",
  "Performance",
  "Architecture",
  "Tooling",
  "AI/Trends",
  "Career",
];

const TYPES: Array<{
  value: ContentType | "All";
  label: string;
  icon: string;
}> = [
  { value: "All", label: "전체", icon: "📋" },
  { value: "news", label: "업계 소식", icon: "📰" },
  { value: "tutorial", label: "학습/가이드", icon: "📚" },
  { value: "release", label: "새 버전 업데이트", icon: "🚀" },
  { value: "tip", label: "유용한 팁", icon: "💡" },
];

interface FilterBarProps {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  totalCount: number;
}

export default function FilterBar({
  filter,
  setFilter,
  totalCount,
}: FilterBarProps) {
  const update = (partial: Partial<FilterState>) =>
    setFilter({ ...filter, ...partial });

  return (
    <div className="space-y-4">
      {/* Search + count */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="기사 검색..."
            className="pr-9 pl-9 input-base"
          />
          {filter.search && (
            <button
              onClick={() => update({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center text-sm text-slate-400">
          <SlidersHorizontal size={14} />
          <span>{totalCount}개 기사</span>
        </div>
        <button
          onClick={() => update({ bookmarked: !filter.bookmarked })}
          className={`btn-ghost text-sm ${filter.bookmarked ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10" : ""}`}
        >
          🔖 북마크
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto gap-2 items-center pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => update({ category: cat })}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              filter.category === cat
                ? cat === "All"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                  : `bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900`
                : cat === "All"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  : `${categoryColors[cat]} hover:opacity-80`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type and Language filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2 items-center">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => update({ type: t.value })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                filter.type === t.value
                  ? "border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Vertical divider on desktop, horizontal on mobile */}
        <div className="hidden w-px h-6 sm:block bg-slate-200 dark:bg-slate-800" />

        {/* Language filter */}
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { value: "All", label: "모든 언어", icon: "🌐" },
            { value: "ko", label: "한국어", icon: "🇰🇷" },
            { value: "en", label: "영어", icon: "🇺🇸" },
          ].map((l) => (
            <button
              key={l.value}
              onClick={() =>
                update({ language: l.value as "All" | "ko" | "en" })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                filter.language === l.value
                  ? "border-accent-500 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {l.icon} {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
