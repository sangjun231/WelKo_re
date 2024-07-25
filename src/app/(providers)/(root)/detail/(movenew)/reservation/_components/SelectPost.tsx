'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPost, Post } from '@/utils/supabase/api/detail/post';

const SelectPost = () => {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  // react-query를 사용하여 데이터 가져오기
  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId // postId가 있을 때만 쿼리 실행
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-screen items-center justify-center">No post found</div>;
  }

  // 가격을 포맷하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const post = data[0];

  return (
    <div className="p-4">
      <button onClick={() => window.history.back()} className="text-2xl">
        ←
      </button>
      <div className="flex items-center space-x-4">
        <div className="flex">
          <img src={post.image} alt={post.title} className="mr-2 w-24" />
          <div className="">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-500">24.8.19~8.22</p> {/* 날짜는 하드코딩 대신 추후 실제 데이터로 대체 */}
            <div className="text-sm font-bold">{formatPrice(post.price)}원</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPost;
