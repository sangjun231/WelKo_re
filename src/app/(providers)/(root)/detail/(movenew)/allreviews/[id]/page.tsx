'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { averageRatings } from '@/utils/averageRating';
import ReactStars from 'react-rating-stars-component';

interface Review {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  content: string;
  rating: number;
}

const AllReviewsPage = () => {
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
    enabled: !!postId // postId가 있을 때만 쿼리 실행
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

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
