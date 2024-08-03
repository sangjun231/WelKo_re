'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Rating from 'react-rating-stars-component';
import { API_MYPAGE_REVIEWS, API_MYPAGE_POST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const ReviewList = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);
  const router = useRouter();

  const fetchReviews = async () => {
    const response = await axios.get(API_MYPAGE_REVIEWS(userId));
    setReviews(response.data);
  };

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      const data: Tables<'posts'>[] = response.data;
      return data;
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
    error
  } = useQuery<Tables<'posts'>[]>({
    queryKey: ['post', userId],
    queryFn: getPostsData,
    enabled: !!userId
  });

  const handleEditReview = (id: string, postId: string) => {
    router.push(`/${userId}/reviewpage?id=${id}&post_id=${postId}`);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(API_MYPAGE_REVIEWS(userId), { data: { id } });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <div>No reviews found</div>
      ) : (
        posts.map((post) => {
          const review = reviews.find((r) => r.post_id === post.id);
          return (
            review && (
              <div key={post.id} className="mb-[20px]">
                <div className="flex">
                  <Image
                    src={post.image ?? '/icons/upload.png'}
                    alt={post.title ?? 'Default title'}
                    width={44}
                    height={44}
                    style={{ width: '44px', height: '44px' }}
                  />
                  <div className="ml-[4px] flex flex-col gap-[4px]">
                    <p className="text-primary-900 line-clamp-1 text-[14px] font-bold">{post.title}</p>
                    <p className="text-[14px] text-grayscale-500">
                      {post.startDate} -{post.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="my-[16px] items-start rounded-[16px] border bg-grayscale-50 p-[16px]">
                    <div className="flex items-center">
                      <Rating count={5} value={review.rating ?? 0} size={24} edit={false} activeColor="#ffd700" />
                      <p className="ml-[4px] text-[13px] text-grayscale-700">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-[12px] text-[14px] text-grayscale-700">{review.content}</p>
                  </div>
                  <div className="flex justify-end gap-[16px]">
                    <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F7F7F9]">
                      <Image src="/icons/tabler-icon-pencil.svg" alt="Edit Review" width={24} height={24} />
                    </button>
                    <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F7F7F9]">
                      <Image src="/icons/tabler-icon-trash.svg" alt="Delete Review" width={24} height={24} />
                    </button>
                  </div>
                </div>
              </div>
            )
          );
        })
      )}
    </div>
  );
};

export default ReviewList;
