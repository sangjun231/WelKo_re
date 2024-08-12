'use client';

import BackButton from '@/components/common/Button/BackButton';
import { formatDateRange } from '@/utils/detail/functions';
import usePostStore from '@/zustand/postStore';
import Image from 'next/image';

const SelectPost = () => {
  const { post } = usePostStore((state) => ({
    post: state.post
  }));

  // 가격을 포맷하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!post) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="mt-12 flex flex-col items-center gap-2">
      <div className="mb-4 flex w-full items-center justify-between py-4">
        <BackButton />
        <h2 className="flex-grow text-center text-lg font-semibold">Pay</h2>
        <div className="w-8"></div>
      </div>
      <div className="flex items-center space-x-4">
        <Image src={post.image} alt={post.title} width={80} height={80} className="rounded" />
        <div>
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
