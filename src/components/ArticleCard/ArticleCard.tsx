import {
  Clock,
  Eye,
  Heart,
  ExternalLink,
} from "lucide-react";
import type { Article } from "../../types";
import { categoryColors, typeLabels } from "../../data/articles";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({
  article,
  featured,
}: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
    locale: ko,
  });

  const getSourceDomain = (url: string) => {
    try {
      if (!url || url === "#" || !url.startsWith("http")) return "";
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  };
  const sourceDomain = getSourceDomain(article.url);

  const typeInfo = typeLabels[article.type];

  if (featured) {
    return (
      <div className="overflow-hidden relative card-hover group animate-in">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br rounded-2xl opacity-0 transition-opacity duration-300 from-brand-500/5 to-accent-500/5 group-hover:opacity-100" />

        <div className="relative z-10 p-6">
          {/* Type & Category */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="text-xs tag bg-brand-500/10 text-brand-600 dark:text-brand-400">
              {typeInfo.icon} {typeInfo.label}
            </span>
            <span className={`tag text-xs ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            {sourceDomain && (
              <span className="text-xs tag bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                🔗 {sourceDomain}
              </span>
            )}
            <span className="flex gap-1 items-center ml-auto text-xs text-slate-400">
              <Clock size={12} />
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-bold leading-tight transition-colors duration-200 text-slate-900 dark:text-slate-50 text-balance group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0"
            >
              {article.title}
            </a>
          </h2>

          {/* Summary */}
          <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
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
          <div className="flex relative z-20 gap-3 items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-br rounded-full from-brand-400 to-accent-500 shrink-0">
                {article.author.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {article.author}
              </span>
            </div>
            <div className="flex gap-3 items-center ml-auto text-xs text-slate-400">
              {article.views && (
                <span className="flex gap-1 items-center">
                  <Eye size={12} />
                  {article.views.toLocaleString()}
                </span>
              )}
              {article.likes && (
                <span className="flex gap-1 items-center">
                  <Heart size={12} />
                  {article.likes.toLocaleString()}
                </span>
              )}
            </div>
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
    <div className="flex overflow-hidden relative flex-col card-hover group animate-in">
      <div className="flex relative z-10 flex-col flex-1 p-5">
        {/* Header */}
        <div className="flex relative z-20 gap-2 items-start mb-3">
          <div className="flex-1 flex flex-wrap gap-1.5 pointer-events-none">
            <span className={`tag text-xs ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            <span className="text-xs tag bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {typeInfo.icon} {typeInfo.label}
            </span>
            {sourceDomain && (
              <span className="text-xs tag bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                🔗 {sourceDomain}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 font-semibold leading-snug transition-colors duration-200 text-slate-900 dark:text-slate-100 text-balance group-hover:text-brand-600 dark:group-hover:text-brand-400">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0"
          >
            {article.title}
          </a>
        </h3>

        {/* Summary */}
        <p className="relative z-10 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
          {article.summary}
        </p>

        {/* Footer */}
        <div className="flex relative z-20 gap-2 items-center pt-3 mt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 pointer-events-none">
            {article.author.charAt(0)}
          </div>
          <span className="flex-1 text-xs truncate pointer-events-none text-slate-500 dark:text-slate-400">
            {article.author}
          </span>
          <span className="text-xs pointer-events-none text-slate-400 shrink-0">
            {timeAgo}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded transition-colors cursor-pointer text-slate-300 dark:text-slate-600 hover:text-brand-500 shrink-0"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
