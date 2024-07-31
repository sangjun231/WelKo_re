import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAuthStore from '@/zustand/bearsStore';
import { useParams } from 'next/navigation';
import { GoPencil, GoTrash } from 'react-icons/go';
import BackButton from '@/components/common/Button/BackButton';
import usePostStore from '@/zustand/postStore';

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const { post } = usePostStore((state) => ({
    post: state.post
  }));
  const [liked, setLiked] = useState(false);

  // 좋아요 상태를 가져오는 함수
  const fetchLikeStatus = async (): Promise<boolean> => {
    const response = await axios.get<{ exists: boolean }>(`/api/detail/likes/${postId}`, {
      headers: { 'user-id': user.id }
    });
    return response.data.exists;
  };

  // 좋아요 상태를 업데이트하는 함수
  const toggleLikeStatus = async (): Promise<void> => {
    if (liked) {
      await axios.delete(`/api/detail/likes/${postId}`, { data: { userId: user.id } });
    } else {
      await axios.post(`/api/detail/likes/${postId}`, { userId: user.id });
    }
  };

  const { data, isError, isPending, refetch } = useQuery<boolean>({
    queryKey: ['likeStatus', postId, user?.id],
    queryFn: fetchLikeStatus,
    enabled: !!postId && !!user?.id
  });

  useEffect(() => {
    if (data !== undefined) {
      setLiked(data);
    }
  }, [data]);

  const likeMutation = useMutation<void, Error>({
    mutationFn: toggleLikeStatus,
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = () => {
    if (!user) {
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }
    if (isPending) return;
    likeMutation.mutate();
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  return (
    <div className="absolute left-0 right-0 top-2 z-10 flex items-center justify-between px-4">
      <BackButton />
      <div className="flex space-x-4">
        {post && post.user_id === user.id && (
          <>
            <div className="icon-button rounded-full">
              <button className="flex h-full w-full items-center justify-center">
                <GoPencil size={24} />
              </button>
            </div>
            <div className="icon-button rounded-full">
              <button className="flex h-full w-full items-center justify-center">
                <GoTrash size={24} />
              </button>
            </div>
          </>
        )}
        <div className="icon-button rounded-full">
          <button onClick={handleLike} className="flex h-full w-full items-center justify-center">
            {liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Likes;
