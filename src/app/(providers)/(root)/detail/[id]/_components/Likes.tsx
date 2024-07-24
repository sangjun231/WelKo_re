import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAuthStore from '@/zustand/bearsStore';
import { useParams } from 'next/navigation';

interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(false);

  // 좋아요 상태를 가져오는 함수
  const fetchLikeStatus = async (postId: string, userId: string): Promise<boolean> => {
    const response = await axios.get<Like[]>(`/api/detail/likes`, {
      headers: { 'user-id': userId }
    });
    return response.data.some((like) => like.post_id === postId && like.user_id === userId);
  };

  // 좋아요 상태를 업데이트하는 함수
  const toggleLikeStatus = async (postId: string, userId: string, liked: boolean): Promise<boolean> => {
    if (liked) {
      const response = await axios.delete(`/api/detail/likes/${postId}`, { data: { userId } });
      if (response.status !== 200) throw new Error('Failed to toggle like status');
      return false;
    } else {
      const response = await axios.post(`/api/detail/likes/${postId}`, { userId });
      if (response.status !== 201) throw new Error('Failed to toggle like status');
      return true;
    }
  };

  const { data, isError, isLoading, refetch } = useQuery<boolean, Error>({
    queryKey: ['likeStatus', postId, user?.id],
    queryFn: () => fetchLikeStatus(postId, user?.id!),
    enabled: !!postId && !!user?.id
  });

  useEffect(() => {
    if (data !== undefined) {
      setLiked(data);
    }
  }, [data]);

  const likeMutation = useMutation<boolean, Error, { postId: string; userId: string; liked: boolean }>({
    mutationFn: ({ postId, userId, liked }) => toggleLikeStatus(postId, userId, liked),
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = () => {
    if (!user) {
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }
    if (isLoading) return;
    likeMutation.mutate({ postId, userId: user.id, liked: !liked });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  return <button onClick={handleLike}>{liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}</button>;
};

export default Likes;
