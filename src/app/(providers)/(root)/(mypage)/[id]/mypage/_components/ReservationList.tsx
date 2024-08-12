'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_POST, API_MYPAGE_REVIEWS, API_MYPAGE_PAYMENTS } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';
import { formatDateRange } from '@/utils/detail/functions';

export default function ReservationList() {
  const params = useParams();
  const router = useRouter();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_POST());
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

  const handleCancelRequest = async (paymentId: string) => {
    try {
      const response = await axios.post(`/api/detail/payment/${paymentId}`, {
        reason: 'User requested cancel',
        requester: 'CUSTOMER'
      });
      alert(response.data.message);
      paymentsQuery.refetch();
    } catch (error) {
      alert('Cancel request failed.');
    }
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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-[8px]">
          <Image src="/icons/tabler-icon-calendar-month.svg" alt="no reservation" width={44} height={44} />
          <p className="text-[14px] font-semibold">You don&apos;t have any Reservation</p>
          <p className="text-[12px]">When you recieve a new meaasge,</p>
          <p className="text-[12px]">it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[360px]">
      {filteredPosts.map((post) => {
        const payment = paymentsQuery.data?.find((pay) => pay.post_id === post.id);
        const status = payment ? tourStatus(post.endDate, payment.pay_state ?? '') : 'N/A';
        const review = reviews.find((review) => review.post_id === post.id);

        return (
          <div key={post.id} className="mb-[20px] border-b pb-[20px]">
            <div className="flex justify-between">
              <div>
                <p className="text-[14px] font-semibold text-grayscale-900">
                  {payment ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                </p>
                <p
                  className={`text-[14px] font-medium ${status === 'Upcoming Tour' ? 'text-primary-300' : status === 'Refunded' ? 'text-error-color' : 'text-grayscale-900'}`}
                >
                  {status}
                </p>
              </div>
              <Link className="flex items-center" href={`/detail/payment/history/${payment?.id}`}>
                <p className="text-[14px] font-semibold text-primary-300">Detail</p>
                <Image src="/icons/tabler-icon-chevron-right-pr300.svg" alt="Edit Profile" width={16} height={16} />
              </Link>
            </div>
            <Link href={`/detail/${post.id}`}>
              <div className="my-[12px] flex">
                <Image
                  className="rounded-[8px]"
                  src={post.image ?? '/icons/upload.png'}
                  alt={post.title ?? 'Default title'}
                  width={80}
                  height={80}
                  style={{ width: '80px', height: '80px' }}
                />
                <div className="ml-[8px] flex flex-col gap-[4px]">
                  <p className="line-clamp-1 text-[14px] font-semibold text-primary-900">{post.title ?? 'No Title'}</p>
                  <p className="text-[14px] text-grayscale-500">{formatDateRange(post.startDate, post.endDate)} </p>
                  <p className="text-[13px] font-medium text-gray-700">
                    <span className="font-semibold text-primary-300">{formatPrice(post.price)}</span>
                    /Person
                  </p>
                </div>
              </div>
            </Link>
            {status === 'Upcoming Tour' ? (
              <div>
                <div className="mb-[12px] flex space-x-[8px]">
                  <button className="flex-1 rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700">
                    Change Tour
                  </button>
                  <button
                    className="flex-1 rounded-lg border bg-primary-300 p-2 text-[14px] font-semibold text-white"
                    onClick={() => {
                      if (payment?.id) {
                        handleCancelRequest(payment.id);
                      }
                    }}
                  >
                    Cancel Tour
                  </button>
                </div>
                <button
                  className="w-full rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700"
                  onClick={() => handleChat(post)}
                >
                  Message Guide
                </button>
              </div>
            ) : status === 'Refunded' ? (
              <button
                className="w-full rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700"
                onClick={() => handleChat(post)}
              >
                Message Guide
              </button>
            ) : (
              <button
                className="w-full rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700"
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
