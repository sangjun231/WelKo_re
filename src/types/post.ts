export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  image: string;
  content: string;
  tag: Record<string, string>;
  area: string;
  price: number;
  period: Record<string, { date: string; events: string[] }>;
  updated_at?: string;
}

