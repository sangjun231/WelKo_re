import { create } from 'zustand';
import axios from 'axios';

interface LikeState {
  liked: boolean;
  fetchLikeStatus: (postId: string, userId: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
}

export const useLikeStore = create<LikeState>((set) => ({
  liked: false,

  fetchLikeStatus: async (postId: string, userId: string) => {
    try {
      const response = await axios.get(`/api/detail/likes/${postId}`, {
        headers: { 'user-id': userId }
      });
      set({ liked: response.data.exists });
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  },

  toggleLike: async (postId: string, userId: string) => {
    try {
      const { liked } = useLikeStore.getState();

      if (liked) {
        await axios.delete(`/api/detail/likes/${postId}`, {
          data: { userId }
        });
        set({ liked: false });
      } else {
        await axios.post(`/api/detail/likes/${postId}`, { userId });
        set({ liked: true });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }
}));
