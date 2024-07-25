'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPost, Post } from '@/utils/supabase/api/detail/post';

export default function Read() {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const [selectedDay, setSelectedDay] = useState<string>('1일차');

  // 가격을 포맷하는 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

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
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex space-x-2">
                  {Object.keys(post.period).map((day) => (
                    <button
                      key={day}
                      className={`rounded px-4 py-2 ${selectedDay === day ? 'bg-blue-500 text-white' : 'bg-gray-400'}`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  {Object.entries(post.period).map(([day, details]) => (
                    <div key={day} className={`${selectedDay === day ? 'block' : 'hidden'}`}>
                      <ul>
                        {details.events.map((event, eventIndex) => (
                          <li key={eventIndex}>{event}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <p>{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
