// 클로드 코드 GitHub 릴리즈와 Dev.to 아티클을 병렬로 가져오는 훅
import { useState, useEffect } from 'react';

export interface GithubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  prerelease: boolean;
}

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  user: { name: string; profile_image: string };
  tag_list: string[];
  public_reactions_count: number;
  reading_time_minutes: number;
  cover_image: string | null;
}

interface UseClaudeNewsReturn {
  releases: GithubRelease[];
  articles: DevToArticle[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClaudeNews(): UseClaudeNewsReturn {
  const [releases, setReleases] = useState<GithubRelease[]>([]);
  const [articles, setArticles] = useState<DevToArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.allSettled([
      fetch('https://api.github.com/repos/anthropics/claude-code/releases?per_page=1')
        .then(r => { if (!r.ok) throw new Error(`GitHub ${r.status}`); return r.json(); }),
      fetch('https://dev.to/api/articles?tag=claudecode&per_page=8&top=7')
        .then(r => { if (!r.ok) throw new Error(`Dev.to ${r.status}`); return r.json(); }),
    ]).then(([releasesResult, articlesResult]) => {
      if (cancelled) return;

      if (releasesResult.status === 'fulfilled') {
        setReleases(Array.isArray(releasesResult.value) ? releasesResult.value : []);
      }
      if (articlesResult.status === 'fulfilled') {
        setArticles(Array.isArray(articlesResult.value) ? articlesResult.value : []);
      }
      if (releasesResult.status === 'rejected' && articlesResult.status === 'rejected') {
        setError('뉴스를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [fetchKey]);

  return { releases, articles, isLoading, error, refetch: () => setFetchKey(k => k + 1) };
}
