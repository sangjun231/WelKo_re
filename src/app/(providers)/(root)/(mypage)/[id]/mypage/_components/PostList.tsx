'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_MYPAGE_POST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

export default function PostList() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      const data: Tables<'posts'>[] = response.data;
      return data
        .filter((post) => post.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const { data, isPending, error, refetch } = useQuery<Tables<'posts'>[]>({
    queryKey: ['post', userId],
    queryFn: getPostsData,
    enabled: !!userId
  });

  const formatPrice = (price: number | null): string => {
    if (price === null) {
      return 'N/A';
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const tourStatus = (endDate: string | null): string => {
    if (!endDate) return 'N/A';
    const currentDate = new Date();
    const tourEndDate = new Date(endDate);
    return tourEndDate < currentDate ? '투어 완료' : '투어 예정';
  };

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div className="mb-10 max-w-[360px]">
      {data.map((post) => {
        const status = tourStatus(post.endDate);

        return (
          <div key={post.id} className="mb-4 border-b pb-4">
            <p className="text-[15px]">{status}</p>
            <p className="text-[15px]">작성 시각 : {new Date(post.created_at).toLocaleString()}</p>
            <Link href={`/detail/${post.id}`}>
              <div className="flex">
                <Image
                  src={post.image ?? '/icons/upload.png'}
                  alt={post.title ?? 'Default title'}
                  width={76}
                  height={76}
                />
                <div className="ml-2 flex flex-col">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold">{post.title}</p>
                  <p className="text-[13px]">
                    {post.startDate} -{post.endDate}
                  </p>
                  <p className="text-[13px]">{formatPrice(post.price)}</p>
                </div>
              </div>
            </Link>
            <div className="mt-2 flex space-x-2">
              <button className="flex-1 rounded-lg border p-2">투어 수정</button>
              <button className="flex-1 rounded-lg border p-2">투어 삭제</button>
            </div>
            {status === '투어 예정' && <button className="mt-2 w-full rounded-lg border p-2">예약자 확인</button>}
          </div>
        );
      })}
    </div>
  );
}
