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
    <div className="web:mt-[20px] web:justify-between mt-2 flex flex-col items-center gap-2">
      <div className="mb-4 flex w-full items-center justify-between py-4">
        <BackButton className="web:hidden" />
        <h2 className="mobile:flex-grow web:text-left web:text-3xl text-center text-lg font-semibold">Pay</h2>
        <div className="w-8"></div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-1">
          <div className="web:h-[140px] web:w-[120px] relative mr-4 h-20 w-20 flex-shrink-0">
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

          <div className="web:gap-2 flex flex-col gap-1">
            <h4 className="web:text-lg web:font-semibold line-clamp-1 text-sm font-semibold">{post.title}</h4>
            <p className="web:text-base text-sm font-normal text-grayscale-500">
              {formatDateRange(post.startDate, post.endDate)}
            </p>
            <div className="web:text-base flex items-center text-xs">
              <span className="web:font-semibold font-semibold text-primary-300">{formatPrice(post.price)}</span>
              <span className="font-medium text-grayscale-700">/Person</span>
            </div>
          </div>
        </div>
        {/* 모바일에서 숨기고, 웹에서만 보이는 Cancellation Policy */}
        <div className="web:block hidden flex-1">
          <h3 className="text-xl font-medium text-text-color">Cancellation Policy</h3>
          <p className="text-base font-normal text-grayscale-500">
            Before you book, make sure you&apos;re comfortable with
            <u className="text-grayscale-900"> this guide&apos;s cancellation policy.</u> If you want a refund, click
            the Request for a <u className="text-grayscale-900">refund button</u> and you will get a refund right away.
            The refund amount will be refunded before 12 o&apos;clock on the same day. You can cancel it for free up to
            two days after payment. After that, there will be a{' '}
            <u className="text-grayscale-900">cancellation penalty.</u>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectPost;
