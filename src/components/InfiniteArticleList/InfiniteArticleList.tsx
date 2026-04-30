import { useState, useEffect, useRef } from 'react';
import ArticleCard from '../ArticleCard/ArticleCard';
import type { Article } from '../../types';

interface Props {
  articles: Article[];
  onToggleBookmark: (id: string) => void;
  itemsPerPage?: number;
}

export default function InfiniteArticleList({ articles, onToggleBookmark, itemsPerPage = 12 }: Props) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset count when the articles list changes (e.g. searching/filtering)
  useEffect(() => {
    setDisplayedCount(itemsPerPage);
  }, [articles, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => Math.min(prev + itemsPerPage, articles.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [articles.length, itemsPerPage]);

  if (articles.length === 0) {
    return (
      <div className="card py-20 text-center text-slate-400">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">검색 결과가 없습니다</h3>
        <p className="text-sm">다른 검색어나 필터를 사용해보세요</p>
      </div>
    );
  }

  const displayedArticles = articles.slice(0, displayedCount);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} onToggleBookmark={onToggleBookmark} />
        ))}
      </div>
      
      {displayedCount < articles.length && (
        <div ref={observerRef} className="py-10 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-brand-500 animate-spin" />
        </div>
      )}
    </>
  );
}
