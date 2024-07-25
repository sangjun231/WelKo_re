import create from 'zustand';
import { Post } from '@/utils/supabase/api/detail/post';

interface PostState {
  postId: string | null;
  post: Post | null;
  setPostId: (id: string | null) => void;
  setPost: (post: Post | null) => void;
}

const usePostStore = create<PostState>((set) => ({
  postId: null,
  post: null,
  setPostId: (id) => set({ postId: id }),
  setPost: (post) => set({ post: post }),
}));

export default usePostStore;
