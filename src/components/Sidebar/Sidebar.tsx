import { TrendingUp, Hash, Flame } from 'lucide-react';
import { categoryColors } from '../../data/articles';
import type { Category, Article } from '../../types';

interface SidebarProps {
  articles: Article[];
}

export default function Sidebar({ articles }: SidebarProps) {
  // Count categories
  const categoryCounts = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6) as [Category, number][];

  // Trending tags
  const tagCounts = articles.reduce<Record<string, number>>((acc, a) => {
    a.tags.forEach((t) => {
      acc[t] = (acc[t] ?? 0) + 1;
    });
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <aside className="space-y-5">
      {/* Hot Articles */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-accent-500" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">인기 기사</h3>
        </div>
        <div className="space-y-3">
          {articles
            .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
            .slice(0, 5)
            .map((article, i) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group"
              >
                <span className={`text-2xl font-black shrink-0 leading-none mt-0.5 ${
                  i === 0 ? 'text-brand-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <span className={`tag text-[10px] mt-1 ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                </div>
              </a>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-brand-500" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">카테고리</h3>
        </div>
        <div className="space-y-2">
          {topCategories.map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className={`tag text-xs ${categoryColors[cat]}`}>{cat}</span>
              <div className="flex items-center gap-2 flex-1 ml-3">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                    style={{ width: `${(count / articles.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-4 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Hash size={16} className="text-success-500" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">트렌딩 태그</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTags.map(([tag, count]) => (
            <a
              key={tag}
              href={`#${tag}`}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-mono inline-block"
            >
              #{tag}
              {count > 1 && (
                <span className="ml-1 text-slate-400 dark:text-slate-600 non-mono">({count})</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
