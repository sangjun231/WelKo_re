// zustand/postStore.ts
import create from 'zustand';
import { Post } from '@/types/post';
import { createClient } from '@/utils/supabase/client';

interface PostState {
  postId: string | null;
  post: Post | null;
  setPostId: (id: string | null) => void;
  setPost: (post: Post | null) => void;
  fetchPost: (id: string) => Promise<Post | null>;
}

const usePostStore = create<PostState>((set) => ({
  postId: null,
  post: null,
  setPostId: (id) => set({ postId: id }),
  setPost: (post) => set({ post }),
  fetchPost: async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    } else {
      const post = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null
      } as Post;
      set({ post });
      return post;
    }
  }
}));

export default usePostStore;
