export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
  password?: string; // Optional: for anonymous edit/delete
  views: number;
}

export interface Comment {
  id: string;
  post_id: string;
  created_at: string;
  author: string;
  content: string;
}
