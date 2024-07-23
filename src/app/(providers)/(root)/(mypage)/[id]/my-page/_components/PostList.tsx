'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { API_MYPAGE_POST } from '@/utils/apiConstants';
import Link from 'next/link';

type Post = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  image: string;
  updated_at?: string;
};

export default function PostList() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedDay, setSelectedDay] = useState<string>('1일차');

  // API 요청 함수
  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      // 필터링 로직을 클라이언트에서 처리
      const data: Post[] = response.data;
      return data.filter((post) => post.user_id === userId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  // react-query를 사용하여 데이터 가져오기
  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ['post', userId],
    queryFn: getPostsData,
    enabled: !!userId
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div className="max-w-[360px]">
      {data.map((post) => (
        <div key={post.id}>
          <p>{new Date(post.created_at).toLocaleString()}</p>
          <Link href={`/detail/${post.id}`}>
            <div className="flex">
              <img className="mb-[20px] mr-2 h-[76px] w-[76px]" src={post.image} alt={post.title} />
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold">{post.title}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
