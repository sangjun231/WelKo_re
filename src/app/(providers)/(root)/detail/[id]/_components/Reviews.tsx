'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews, Review } from '@/utils/supabase/api/detail/reviews';
import { averageRatings } from '@/utils/detail/averageRating';
import useAuthStore from '@/zustand/bearsStore';
import { FaStar } from 'react-icons/fa6';
import { formatRelativeDate } from '@/utils/detail/formatRelativeDate';

const Reviews = () => {
  const user = useAuthStore((state) => state.user);
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // React Query를 사용하여 리뷰 데이터 가져오기
  const {
    data: reviews,
    isPending,
    error
  } = useQuery<Review[]>({
    queryKey: ['reviews', postId],
    queryFn: () => fetchReviews(postId),
    enabled: !!postId
  });

  // 평균 평점 계산
  const averageRating = averageRatings(reviews || []);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  return (
    <div className="mb-32 flex gap-6">
      <div className="flex flex-col gap-4">
        <div className="text-grayscale-900 flex items-center gap-1 text-lg">
          <FaStar size={24} />
          <h2 className="font-semibold">{averageRating.toFixed(2)}</h2>
          <span className="font-medium">·</span>
          <span className="font-medium">{reviews.length} reviews</span>
        </div>
        <div className="bg-grayscale-50 gap-3 rounded-2xl p-4">
          {reviews.slice(0, 1).map((review) => (
            <div key={review.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FaStar size={16} />
                <h4 className="text-xs font-semibold">{review.rating.toFixed(2)}</h4>
                <span className="text-xs text-gray-900">{review.user_name}</span>
                <span className="text-[10px] font-normal text-gray-700">{formatRelativeDate(review.created_at)}</span>
              </div>
              <p className="line-clamp-3 text-sm font-normal text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
        <button
          className="w-full rounded-xl border border-gray-800 px-5 py-3 text-center text-base font-semibold text-gray-700"
          onClick={() => router.push(`/detail/allreviews/${postId}`)}
        >
          Show more reviews
        </button>
      </div>
    </div>
  );
};

export default Reviews;
