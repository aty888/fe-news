import { Article } from '../types';

export const articles: Article[] = [];

export const categoryColors: Record<string, string> = {
  JavaScript: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  TypeScript: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Frameworks: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  Styling: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  'Web/Browser': 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  Performance: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Architecture: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  Tooling: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  'AI/Trends': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Career: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
};

export const typeLabels: Record<string, { label: string; icon: string }> = {
  news: { label: '업계 소식', icon: '📰' },
  tutorial: { label: '학습/가이드', icon: '📚' },
  release: { label: '새 버전 업데이트', icon: '🚀' },
  tip: { label: '유용한 팁', icon: '💡' },
  discussion: { label: '토론', icon: '💬' },
};
