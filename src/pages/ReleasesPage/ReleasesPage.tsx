import InfiniteArticleList from '../../components/InfiniteArticleList/InfiniteArticleList';
import FilterBar from '../../components/FilterBar/FilterBar';
import Sidebar from '../../components/Sidebar/Sidebar';
import type { Article } from '../../types';
import type { FilterState } from '../../hooks/useArticles';
import { Rocket } from 'lucide-react';

interface ReleasesPageProps {
  articles: Article[];
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  onToggleBookmark: (id: string) => void;
}

export default function ReleasesPage({ articles, filter, setFilter, onToggleBookmark }: ReleasesPageProps) {
  const releases = articles.filter((a) => a.type === 'release');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Rocket size={26} className="text-brand-500" />
        <div>
          <h1 className="section-title">릴리즈 노트</h1>
          <p className="text-sm text-muted mt-0.5">프레임워크와 라이브러리의 최신 릴리즈를 확인하세요</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="mb-6">
            <FilterBar filter={filter} setFilter={setFilter} totalCount={releases.length} />
          </div>
          <InfiniteArticleList articles={releases} onToggleBookmark={onToggleBookmark} />
        </div>
        <Sidebar articles={articles} />
      </div>
    </div>
  );
}
