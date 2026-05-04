export interface Message {
  id: string;
  created_at: string;
  author: string;
  content: string;
  avatar_url?: string;
}

export interface DiscussionRoom {
  id: string;
  title: string;
  description: string;
  created_at: string;
}
