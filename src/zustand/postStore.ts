import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { Post } from '@/types/posts';

interface PostState {
  postId: string | null;
  post: Post | null;
  setPostId: (id: string | null) => void;
  setPost: (post: Post | null) => void;
  fetchPost: (id: string) => Promise<void>;
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
    } else {
      set({ post: data });
    }
  }
}));

export default usePostStore;
