import axios from 'axios';

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

export const fetchPost = async (postId: string): Promise<Post[]> => {
  try {
    const response = await axios.get('/api/post');
    // 필터링 로직을 클라이언트에서 처리
    const data: Post[] = response.data;
    return data.filter((post) => post.id === postId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
