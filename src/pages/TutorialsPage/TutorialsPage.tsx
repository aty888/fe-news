import InfiniteArticleList from '../../components/InfiniteArticleList/InfiniteArticleList';
import FilterBar from '../../components/FilterBar/FilterBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import type { Article } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { BookOpen } from 'lucide-react';

interface TutorialsPageProps {
  articles: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
}

export default function TutorialsPage({ articles, filter, setFilter, onToggleBookmark }: TutorialsPageProps) {
  const tutorials = articles.filter((a) => a.type === 'tutorial' || a.type === 'tip');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={26} className="text-brand-500" />
        <div>
          <h1 className="section-title">튜토리얼 & 팁</h1>
          <p className="text-sm text-muted mt-0.5">실용적인 튜토리얼과 개발 팁을 배워보세요</p>
        </div>
      </div>
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
  );
}
