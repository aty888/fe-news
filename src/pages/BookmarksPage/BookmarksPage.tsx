import { BookmarkCheck, BookmarkX } from 'lucide-react';
import ArticleCard from '../../components/ArticleCard/ArticleCard';
import type { Article } from '../../types';

interface BookmarksPageProps {
  articles: Article[];
  onToggleBookmark: (id: string) => void;
}

export default function BookmarksPage({ articles, onToggleBookmark }: BookmarksPageProps) {
  const bookmarked = articles.filter((a) => a.isBookmarked);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <BookmarkCheck size={26} className="text-brand-500" />
        <div>
          <h1 className="section-title">북마크</h1>
          <p className="text-sm text-muted mt-0.5">저장한 기사 {bookmarked.length}개</p>
        </div>
      </div>

      {bookmarked.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarked.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="card py-24 text-center">
          <BookmarkX size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">
            저장된 기사가 없습니다
          </h3>
          <p className="text-sm text-slate-400">
            기사 카드의 북마크 아이콘을 클릭해 저장해보세요
          </p>
        </div>
      )}
    </div>
  );
}
