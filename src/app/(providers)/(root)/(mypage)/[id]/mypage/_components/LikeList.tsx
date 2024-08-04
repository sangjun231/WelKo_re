'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '@/zustand/bearsStore';
import { Tables } from '@/types/supabase';
import { API_MYPAGE_LIKES } from '@/utils/apiConstants';
import Like from './Like';

export default function LikeList() {
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const user = useAuthStore((state) => state.user);

  const getLikedPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_LIKES(userId));
      const data: Tables<'posts'>[] = response.data.posts;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const { data, isPending, error, refetch } = useQuery<Tables<'posts'>[]>({
    queryKey: ['likedPosts', userId],
    queryFn: getLikedPostsData,
    enabled: !!userId
  });

  const formatPrice = (price: number | null): string => {
    if (price === null) {
      return 'N/A';
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  if (isPending) return <div className="flex items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="gap-[8px]">
          <Image src="/icons/tabler-icon-heart.svg" alt="no wishlist" width={44} height={44} />
          <p className="text-[14px] font-semibold">You don&apos;t have any Wishlist</p>
          <p className="text-[12px]">When you recieve a new meaasge, it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[360px]">
      {data.map((post) => (
        <div key={post.id} className="relative mb-[16px]">
          <div className="flex">
            <div className="relative">
              <Link href={`/detail/${post.id}`}>
                <Image
                  src={post.image ?? '/icons/upload.png'}
                  alt={post.title ?? 'Default title'}
                  width={80}
                  height={100}
                  style={{ width: '80px', height: '100px' }}
                />
              </Link>
              <Like postId={post.id} userId={user.id} />
            </div>
            <Link href={`/detail/${post.id}`}>
              <div className="ml-[8px] space-y-[4px]">
                <p className="text-primary-900 line-clamp-1 text-[14px] font-semibold">{post.title}</p>
                <p className="text-[14px] text-grayscale-500">
                  {post.startDate && post.endDate
                    ? `${new Date(post.startDate).toLocaleDateString()} - ${new Date(post.endDate).toLocaleDateString()}`
                    : 'No date information'}
                </p>
                <p className="text-[13px] font-medium text-grayscale-700">
                  <span className="font-semibold text-primary-300">{formatPrice(post.price)}</span>
                  /Person
                </p>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
