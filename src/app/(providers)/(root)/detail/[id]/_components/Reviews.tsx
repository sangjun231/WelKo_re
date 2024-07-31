'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews, Review } from '@/utils/supabase/api/detail/reviews';
import { averageRatings } from '@/utils/detail/averageRating';
import ReactStars from 'react-rating-stars-component';

const Reviews = () => {
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

  if (!reviews || reviews.length === 0) {
    return <div className="flex h-screen items-center justify-center">No reviews found</div>;
  }

  return (
    <div>
      <h2>평균 점수: {averageRating} / 5.0</h2>
      <ReactStars count={5} value={averageRating} size={24} isHalf={true} edit={false} activeColor="#ffd700" />
      <h2>후기: {reviews.length}개</h2>
      <div>
        {reviews.slice(0, 1).map((review) => (
          <div key={review.id} className="mb-4 border-b p-2">
            <p>평점: {review.rating} / 5.0</p>
            <ReactStars count={5} value={review.rating} size={24} isHalf={true} edit={false} activeColor="#ffd700" />
            <p>{review.content}</p>
            <p>{new Date(review.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <button className="mb-6 border" onClick={() => router.push(`/detail/allreviews/${postId}`)}>
        후기 {reviews.length}개 모두 보기
      </button>
    </div>
  );
};

export default Reviews;
