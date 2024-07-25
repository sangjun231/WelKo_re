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
    <div className="max-w-[360px]">
      {data.map((post) => (
        <div key={post.id} className="relative">
          <p>{new Date(post.created_at).toLocaleString()}</p>
          <Link href={`/detail/${post.id}`}>
            <div className="flex">
              <Image
                className="mb-[20px] mr-2"
                src={post.image ?? '/icons/menu.png'}
                alt={post.title ?? 'Default title'}
                width={76}
                height={76}
              />
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-bold">{post.title}</p>
            </div>
          </Link>
          <Like postId={post.id} userId={user.id} />
        </div>
      ))}
    </div>
  );
}
