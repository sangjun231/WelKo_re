'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_MYPAGE_POST, API_MYPAGE_REVIEWS, API_MYPAGE_PAYMENTS } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

export default function ReservationList() {
  const params = useParams();
  const router = useRouter();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      const data: Tables<'posts'>[] = response.data;
      return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const {
    data: posts,
    isPending,
    error,
    refetch: refetchPosts
  } = useQuery<Tables<'posts'>[]>({
    queryKey: ['post', userId],
    queryFn: getPostsData,
    enabled: !!userId
  });

  const getPaymentsData = async (userId: string) => {
    try {
      const response = await axios.get(API_MYPAGE_PAYMENTS(userId));
      return response.data as Tables<'payments'>[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const paymentsQuery = useQuery<Tables<'payments'>[]>({
    queryKey: ['payments', userId],
    queryFn: () => getPaymentsData(userId),
    enabled: !!userId
  });

  const getReviewsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_REVIEWS(userId));
      return response.data as Tables<'reviews'>[];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const reviewsQuery = useQuery<Tables<'reviews'>[]>({
    queryKey: ['reviews', userId],
    queryFn: getReviewsData,
    enabled: !!userId
  });

  const formatPrice = (price: number | null): string => {
    if (price === null) {
      return 'N/A';
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const tourStatus = (endDate: string | null, payState: string | null): string => {
    if (payState === 'cancel') return 'Refunded';
    if (!endDate) return 'N/A';
    const currentDate = new Date();
    const tourEndDate = new Date(endDate);
    return tourEndDate < currentDate ? 'Tour Completed' : 'Upcoming Tour';
  };

  const handleReviewAction = (postId: string, reviewId?: string) => {
    if (reviewId) {
      router.push(`/${userId}/reviewpage?id=${reviewId}&post_id=${postId}`);
    } else {
      router.push(`/${userId}/reviewpage?post_id=${postId}`);
    }
  };

  const handleChat = (post: Tables<'posts'>) => {
    const postAuthorId = post.user_id;
    const query = new URLSearchParams({
      postId: post.id,
      postTitle: post.title || '',
      postImage: post.image || ''
    }).toString();
    router.push(`/${userId}/${postAuthorId}/chatpage?${query}`);
  };

  const filteredPosts =
    posts?.filter((post) =>
      paymentsQuery.data?.some((payment) => payment.post_id === post.id && payment.user_id === userId)
    ) ?? [];

  useEffect(() => {
    if (reviewsQuery.data) {
      setReviews(reviewsQuery.data);
    }
  }, [reviewsQuery.data]);

  useEffect(() => {
    refetchPosts();
    paymentsQuery.refetch();
    reviewsQuery.refetch();
  }, [userId, refetchPosts, paymentsQuery.refetch, reviewsQuery.refetch]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div className="mb-10 max-w-[360px]">
      {filteredPosts.map((post) => {
        const payment = paymentsQuery.data?.find((pay) => pay.post_id === post.id);
        const status = payment ? tourStatus(post.endDate, payment.pay_state ?? '') : 'N/A';
        const review = reviews.find((review) => review.post_id === post.id);

        return (
          <div key={post.id} className="mb-4 border-b pb-4">
            <p className="text-[15px]">{status}</p>
            <div className="flex justify-around">
              <p className="text-[15px]">
                Payment at: {payment ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <Link href={`/detail/payment/${payment?.id}`}>
                <p className="text-[15px]">결제 상세보기</p>
              </Link>
            </div>
            <Link href={`/detail/${post.id}`}>
              <div className="flex">
                <Image
                  src={post.image ?? '/icons/upload.png'}
                  alt={post.title ?? 'Default title'}
                  width={76}
                  height={76}
                />
                <div className="ml-2 flex flex-col">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold">
                    {post.title ?? 'No Title'}
                  </p>
                  <p className="text-[13px]">
                    {post.startDate ?? 'No Start Date'} - {post.endDate ?? 'No End Date'}
                  </p>
                  <p className="text-[13px]">{formatPrice(post.price)}</p>
                </div>
              </div>
            </Link>
            {status === 'Upcoming Tour' ? (
              <div>
                <div className="my-2 flex space-x-2">
                  <button className="flex-1 rounded-lg border p-2">Change Tour</button>
                  <button className="flex-1 rounded-lg border p-2">Cancel Tour</button>
                </div>
                <button className="w-full rounded-lg border p-2" onClick={() => handleChat(post)}>
                  Message Host
                </button>
              </div>
            ) : status === 'Refunded' ? (
              <p className="mt-2 w-full text-center text-red-500">Refunded</p>
            ) : (
              <button
                className="mt-2 w-full rounded-lg border p-2"
                onClick={() => {
                  handleReviewAction(post.id, review?.id);
                }}
              >
                {review ? 'View Review' : 'Write a Review'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
