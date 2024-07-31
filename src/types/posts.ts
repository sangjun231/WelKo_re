export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  image: string;
  content: string | null;
  tag: string[] | null;
  area: string | null;
  price: number;
  startDate: string | null;
  endDate: string | null;
  updated_at?: string | null;
}
