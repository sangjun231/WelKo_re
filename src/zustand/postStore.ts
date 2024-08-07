import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { Post } from '@/types/posts';

interface PostState {
  postId: string | null;
  post: Post | null;
  userName: string | null;
  setPostId: (id: string | null) => void;
  setPost: (post: Post | null) => void;
  setUserName: (name: string | null) => void;
  fetchPost: (id: string) => Promise<void>;
}

const usePostStore = create<PostState>((set) => ({
  postId: null,
  post: null,
  userName: null,
  setPostId: (id) => set({ postId: id }),
  setPost: (post) => set({ post }),
  setUserName: (name) => set({ userName: name }),
  fetchPost: async (id: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        users!posts_user_id_fkey1 (
          name
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      set({ post: data, userName: data.users.name });
    }
  }
}));

export default usePostStore;
