'use client';

import React from 'react';
import Image from 'next/image';
import usePostStore from '@/zustand/postStore';

const SelectPost = () => {
  const { post } = usePostStore((state) => ({
    post: state.post,
  }));

  if (!post) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // 가격을 포맷하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="p-4">
      <button onClick={() => window.history.back()} className="text-2xl">
        ←
      </button>
      <div className="flex items-center space-x-4">
        <div className="flex">
          <Image src={post.image} alt={post.title} width={96} height={96} className="mr-2 w-24" />
          <div className="">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-500">24.8.19~8.22</p> {/* 날짜는 하드코딩 대신 추후 실제 데이터로 대체 */}
            <div className="text-sm font-bold">{formatPrice(post.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPost;
