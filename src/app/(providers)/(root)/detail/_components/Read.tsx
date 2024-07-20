'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'next/navigation';

export interface Post {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  image: string;
  content: string;
  tag: Record<string, string>;
  area: string;
  price: number;
  period: Record<string, { date: string; events: string[] }>;
  updated_at?: string;
}

export default function Read() {
  const { id } = useParams();

  // API 요청 함수
  const getPostsData = async () => {
    try {
      const response = await axios.get('/api/post');
      // 필터링 로직을 클라이언트에서 처리
      const data: Post[] = response.data;
      return data.filter((post) => post.id === id);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  // 가격을 포맷하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // react-query를 사용하여 데이터 가져오기
  const { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ['post', id],
    queryFn: getPostsData,
    enabled: !!id // id가 있을 때만 쿼리 실행
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="w-full p-[40px]">
        {data.map((post) => (
          <div key={post.id}>
            <div className="w-full">
              <img src={post.image} alt={post.title} className="mb-[20px] h-[300px] w-[300px]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{post.title}</h1>
            </div>
            <div className="text-md">
              <p>
                <strong>{formatPrice(post.price)}원</strong>
              </p>
              <p>{post.content}</p>
              <div>
                <ul>
                  {Object.entries(post.tag).map(([key, value]) => (
                    <li key={key}>
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {Object.entries(post.period).map(([day, details]) => (
                  <div key={day}>
                    <h2 className="text-xl font-semibold">{day}</h2>
                    <ul>
                      {details.events.map((event, eventIndex) => (
                        <li key={eventIndex}>{event}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {/* 일단 게시물 작성 시간을 넣긴 했는데, 이거 UI에서도 보여줘야되는걸까요?? */}
              <p>{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
