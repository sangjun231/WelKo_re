'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews, Review } from '@/utils/supabase/api/detail/reviews';
import { averageRatings } from '@/utils/averageRating';
import ReactStars from 'react-rating-stars-component';

const AllReviewsPage = () => {
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
    enabled: !!postId // postId가 있을 때만 쿼리 실행
  });

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="flex h-screen items-center justify-center">No reviews found</div>;
  }

  // 평균 평점 계산
  const averageRating: number = averageRatings(reviews || []);

  return (
    <div>
      <h2>평균 점수: {averageRating} / 5.0</h2>
      <ReactStars count={5} value={averageRating} size={24} isHalf={true} edit={false} activeColor="#ffd700" />
      <h2>후기: {reviews.length}개</h2>
      <div>
        {reviews.map((review) => (
          <div key={review.id} className="mb-4 border-b p-2">
            <p>{review.content}</p>
            <ReactStars count={5} value={review.rating} size={24} isHalf={true} edit={false} activeColor="#ffd700" />
            <small>{new Date(review.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <button className="mt-6 border" onClick={() => router.back()}>
        뒤로가기
      </button>
    </div>
  );
};

export default AllReviewsPage;
