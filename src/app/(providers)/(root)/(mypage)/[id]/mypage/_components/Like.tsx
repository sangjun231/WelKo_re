'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { API_MYPAGE_LIKES } from '@/utils/apiConstants';

type LikeProps = {
  postId: string;
  userId: string;
};

const Like: React.FC<LikeProps> = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);

  const fetchLikeStatus = async (): Promise<boolean> => {
    const response = await axios.get(API_MYPAGE_LIKES(userId));
    const likedPosts = response.data.posts.map((post: any) => post.id);
    return likedPosts.includes(postId);
  };

  const toggleLikeStatus = async (): Promise<void> => {
    await axios.put(API_MYPAGE_LIKES(userId), { postId });
  };

  const { data, isError, isLoading, refetch } = useQuery<boolean>({
    queryKey: ['likeStatus', postId, userId],
    queryFn: fetchLikeStatus,
    enabled: !!postId && !!userId
  });

  const likeMutation = useMutation<void, Error>({
    mutationFn: toggleLikeStatus,
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (isLoading) return;

    likeMutation.mutate();
  };

  useEffect(() => {
    if (data !== undefined) {
      setLiked(data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  return (
    <button
      className="web:right-[16px] web:top-[16px] absolute right-[4px] top-[8px] rounded-[24px] backdrop-blur-[10px]"
      onClick={handleLike}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.10)'
      }}
    >
      <Image
        className="web:w-[44px] web:h-[44px] h-[24px] w-[24px]"
        src={liked ? '/icons/tabler-icon-heart-filled.svg' : '/icons/tabler-icon-post-heart.svg'}
        alt="heart icon"
        width={24}
        height={24}
      />
    </button>
  );
};

export default Like;
