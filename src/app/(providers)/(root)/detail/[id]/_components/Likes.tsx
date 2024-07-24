import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAuthStore from '@/zustand/bearsStore';
import { useParams } from 'next/navigation';

interface LikeResponse {
  liked: boolean;
}

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(false);

  // 좋아요 상태를 가져오는 함수
  const fetchLikeStatus = async (postId: string, userId: string): Promise<LikeResponse> => {
    const response = await axios.get<LikeResponse>(`/api/detail/likes/${postId}`, {
      headers: { 'user-id': userId }
    });
    return response.data || { liked: false }; // 데이터가 없을 경우 기본값 반환
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

  const { data, isError, isLoading, refetch } = useQuery<LikeResponse>({
    queryKey: ['likeStatus', postId, user?.id],
    queryFn: () => fetchLikeStatus(postId, user?.id!),
    enabled: !!postId && !!user?.id
  });

  useEffect(() => {
    if (data) {
      setLiked(data.liked);
    }
  }, [data]);

  const likeMutation = useMutation<boolean, Error, { postId: string; userId: string; liked: boolean }>({
    mutationFn: ({ postId, userId, liked }) => toggleLikeStatus(postId, userId, liked),
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = () => {
    if (isLoading) return;
    likeMutation.mutate({ postId, userId: user.id, liked: !liked });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  return <button onClick={handleLike}>{liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}</button>;
};

export default Likes;
