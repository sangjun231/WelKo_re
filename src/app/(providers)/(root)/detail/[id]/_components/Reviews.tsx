'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { averageRatings } from '@/utils/averageRating';
import ReactStars from 'react-rating-stars-component';

interface Review {
  id: string;
  created_at: string;
  user_id: string;
  userName: string;
  post_id: string;
  content: string;
  rating: number;
}

const Reviews = () => {
  const { id: postId } = useParams();
  const router = useRouter();

  // 리뷰 데이터를 가져오는 함수
  const fetchReviews = async (): Promise<Review[]> => {
    const response = await axios.get(`/api/detail/reviews/${postId}`);
    return response.data;
  };

  // React Query를 사용하여 리뷰 데이터 가져오기
  const {
    data: reviews,
    isLoading,
    error
  } = useQuery<Review[]>({
    queryKey: ['reviews', postId],
    queryFn: fetchReviews,
    enabled: !!postId
  });

  // 평균 평점 계산
  const averageRating = averageRatings(reviews || []);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="flex h-screen items-center justify-center">No reviews found</div>;
  }

  return (
    <div>
      <h2>평균 점수: {averageRating} / 5.0</h2>
      <ReactStars
        count={5}
        value={averageRating}
        size={24}
        isHalf={true}
        edit={false}
        activeColor="#ffd700"
      />
      <h2>후기: {reviews.length}개</h2>
      <div>
        {reviews.slice(0, 1).map((review) => (
          <div key={review.id} className="mb-4 border-b p-2">
            <p>평점: {review.rating} / 5.0</p>
            <ReactStars
              count={5}
              value={review.rating}
              size={24}
              isHalf={true}
              edit={false}
              activeColor="#ffd700"
            />
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
