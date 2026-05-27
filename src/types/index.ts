export type Category =
  | 'JavaScript'
  | 'TypeScript'
  | 'Frameworks'
  | 'Styling'
  | 'Web/Browser'
  | 'Performance'
  | 'Architecture'
  | 'Tooling'
  | 'AI/Trends'
  | 'Career';

export type ContentType = 'news' | 'tutorial' | 'release' | 'tip' | 'discussion';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: Category;
  type: ContentType;
  author: string;
  authorAvatar?: string;
  publishedAt: string;
  readTime: number;
  url: string;
  tags: string[];
  isFeatured?: boolean;
  imageUrl?: string;
  views?: number;
  likes?: number;
  language?: 'ko' | 'en';
}

export interface NewsletterSubscription {
  email: string;
  categories: Category[];
}
