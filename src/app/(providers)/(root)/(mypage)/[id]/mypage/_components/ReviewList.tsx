'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Rating from 'react-rating-stars-component';
import { API_MYPAGE_REVIEWS } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const ReviewList = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await axios.delete(API_MYPAGE_REVIEWS(userId), { data: { id } });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const fetchReviews = async () => {
    const response = await axios.get(API_MYPAGE_REVIEWS(userId));
    setReviews(response.data);
  };

  const handleCreateReview = (postId: string) => {
    router.push(`/${userId}/reviewpage?post_id=${postId}`);
  };

  const handleEditReview = (id: string, postId: string | null) => {
    router.push(`/${userId}/reviewpage?id=${id}&post_id=${postId}`);
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  return (
    <div>
      <button onClick={() => handleCreateReview('yourPostIdHere')}>Create New Review</button>
      {reviews.length === 0 ? (
        <div>Loading...</div>
      ) : (
        reviews.map((item) => (
          <div key={item.id}>
            <Rating count={5} value={item.rating ?? 0} size={24} edit={false} activeColor="#ffd700" />
            <p>{item.content}</p>
            <div className="mt-2 flex justify-around">
              <button onClick={() => handleEditReview(item.id, item.post_id)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
