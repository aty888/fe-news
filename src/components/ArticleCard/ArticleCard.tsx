import { Bookmark, BookmarkCheck, Clock, Eye, Heart, ExternalLink } from 'lucide-react';
import type { Article } from '../../types';
import { categoryColors, typeLabels } from '../../data/articles';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  onToggleBookmark: (id: string) => void;
  featured?: boolean;
}

export default function ArticleCard({ article, onToggleBookmark, featured }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: ko,
  });

  const typeInfo = typeLabels[article.type];

  if (featured) {
    return (
      <div className="card-hover group relative overflow-hidden animate-in">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="p-6 relative z-10">
          {/* Type & Category */}
          <div className="flex items-center gap-2 mb-4">
            <span className="tag bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs">
              {typeInfo.icon} {typeInfo.label}
            </span>
            <span className={`tag text-xs ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 leading-tight text-balance group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
              {article.title}
            </a>
          </h2>

          {/* Summary */}
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4 relative z-20 pointer-events-none">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {article.author.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-3 ml-auto text-xs text-slate-400">
              {article.views && (
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {article.views.toLocaleString()}
                </span>
              )}
              {article.likes && (
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {article.likes.toLocaleString()}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {article.readTime}분
              </span>
            </div>
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                article.isBookmarked
                  ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10'
                  : 'text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10'
              }`}
            >
              {article.isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all duration-200 cursor-pointer"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Default compact card
  return (
    <div className="card-hover group flex flex-col animate-in relative overflow-hidden">
      <div className="p-5 flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3 relative z-20">
          <div className="flex-1 flex flex-wrap gap-1.5 pointer-events-none">
            <span className={`tag text-xs ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            <span className="tag bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs">
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>
          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`p-1.5 rounded-lg shrink-0 transition-all duration-200 cursor-pointer ${
              article.isBookmarked
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'text-slate-300 dark:text-slate-600 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10'
            }`}
          >
            {article.isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug text-balance group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
            {article.title}
          </a>
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 relative z-10">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 relative z-20">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 pointer-events-none">
            {article.author.charAt(0)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1 pointer-events-none">
            {article.author}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 pointer-events-none">
            <Clock size={11} />
            {article.readTime}분
          </span>
          <span className="text-xs text-slate-400 shrink-0 pointer-events-none">{timeAgo}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-slate-300 dark:text-slate-600 hover:text-brand-500 transition-colors shrink-0 cursor-pointer"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
