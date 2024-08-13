'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';
import { formatDateRange } from '@/utils/detail/functions';
import BackButton from '@/components/common/Button/BackButton';
import useAuthStore from '@/zustand/bearsStore';
import LikeBtn from '/public/icons/tabler-icon-post-heart.svg';
import { useLikeStore } from '@/zustand/likeStore';

const SelectPost = () => {
  const { post } = usePostStore((state) => ({
    post: state.post
  }));
  const user = useAuthStore((state) => state.user);

  const { liked, fetchLikeStatus, toggleLike } = useLikeStore((state) => ({
    liked: state.liked,
    fetchLikeStatus: state.fetchLikeStatus,
    toggleLike: state.toggleLike
  }));

  useEffect(() => {
    if (post?.id && user?.id) {
      fetchLikeStatus(post.id, user.id);
    }
  }, [post?.id, user?.id, fetchLikeStatus]);

  const handleLike = () => {
    if (post?.id && user?.id) {
      toggleLike(post.id, user.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!post) return <div className="flex items-center justify-center">Loading...</div>;

  return (
    <div className="mt-2 flex flex-col items-center gap-2">
      <div className="mb-4 flex w-full items-center justify-between py-4">
        <BackButton />
        <h2 className="flex-grow text-center text-lg font-semibold">Pay</h2>
        <div className="w-8"></div>
      </div>
      <div className="flex w-full space-x-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden">
          <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} className="rounded-lg" />
          <button
            onClick={handleLike}
            className="absolute right-1 top-2 rounded-full bg-[rgba(255,255,255,0.10)] p-0.5 backdrop-blur-[10px]"
          >
            {liked ? (
              <LikeBtn width={20} height={20} color="#FF7029" fill="#FF7029" />
            ) : (
              <LikeBtn width={20} height={20} color="white" />
            )}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="line-clamp-1 text-sm font-semibold">{post.title}</h4>
          <p className="text-sm font-normal text-grayscale-500">{formatDateRange(post.startDate, post.endDate)}</p>
          <div className="flex items-center text-xs">
            <span className="font-semibold text-primary-300">{formatPrice(post.price)}</span>
            <span className="font-medium text-grayscale-600">/Person</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPost;
