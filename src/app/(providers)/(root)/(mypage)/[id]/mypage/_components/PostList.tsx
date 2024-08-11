'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_MYPAGE_POST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';
import { formatDateRange } from '@/utils/detail/functions';
import { DeletePost } from '@/app/(providers)/(root)/postpage/[id]/_components/PostEdit';

export default function PostList() {
  const params = useParams();
  const router = useRouter();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      return response.data;
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
    return tourEndDate < currentDate ? 'Tour Completed' : 'Upcoming Tour';
  };

  const handleReservationList = (postId: string) => {
    router.push(`/${userId}/mypage/tourreservationlistpage?postId=${postId}`);
  };

  const handleDelete = DeletePost();

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-[8px]">
          <Image src="/icons/tabler-icon-sticker-2.svg" alt="no post" width={44} height={44} />
          <p className="text-[14px] font-semibold">You don&apos;t have any post</p>
          <p className="text-[12px]">When you receive a new message,</p>
          <p className="text-[12px]">it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[360px]">
      {data.map((post: Tables<'posts'>) => {
        const status = tourStatus(post.endDate);

        return (
          <div key={post.id} className="mb-[20px] border-b pb-[20px]">
            <div className="mb-[12px] flex justify-between">
              <div>
                <p className="text-[14px] font-semibold text-grayscale-900">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p
                  className={`text-[14px] font-medium ${status === 'Upcoming Tour' ? 'text-primary-300' : 'text-grayscale-900'}`}
                >
                  {status}
                </p>
              </div>
              <div className="flex gap-[16px]">
                <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F7F7F9]">
                  <Image src="/icons/tabler-icon-pencil.svg" alt="Edit Tour" width={24} height={24} />
                </button>
                <button
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F7F7F9]"
                  onClick={() => handleDelete(post.id)}
                >
                  <Image src="/icons/tabler-icon-trash.svg" alt="Delete Tour" width={24} height={24} />
                </button>
              </div>
            </div>
            <Link href={`/detail/${post.id}`}>
              <div className="flex">
                <Image
                  className="rounded-[8px]"
                  src={post.image ?? '/icons/upload.png'}
                  alt={post.title ?? 'Default title'}
                  width={80}
                  height={80}
                  style={{ width: '80px', height: '80px' }}
                />
                <div className="ml-[4px] flex flex-col gap-[4px]">
                  <p className="line-clamp-1 text-[14px] font-semibold text-primary-900">{post.title}</p>
                  <p className="text-[14px] text-grayscale-500">{formatDateRange(post.startDate, post.endDate)}</p>
                  <p className="text-[13px] font-semibold text-grayscale-700">
                    <span className="font-medium text-primary-300">{formatPrice(post.price)}</span>
                    /Person
                  </p>
                </div>
              </div>
            </Link>
            <button
              className="mt-[12px] w-full rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700"
              onClick={() => {
                handleReservationList(post.id);
              }}
            >
              Reservation List
            </button>
          </div>
        );
      })}
    </div>
  );
}
