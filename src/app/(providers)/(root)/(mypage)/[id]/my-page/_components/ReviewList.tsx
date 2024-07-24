'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Rating from 'react-rating-stars-component';
import { API_MYPAGE_REVIEWS } from '@/utils/apiConstants';

type Review = {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  rating: number;
};

const ReviewList = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleDelete = async (id: string) => {
    await axios.delete(API_MYPAGE_REVIEWS(userId), { data: { id } });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const fetchReviews = async () => {
    const response = await axios.get(API_MYPAGE_REVIEWS(userId));
    setReviews(response.data);
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  return (
    <div>
      <Link href={`/${userId}/review-page`}>
        <button>Create New Review</button>
      </Link>
      {reviews.length === 0 ? (
        <div>Loading...</div>
      ) : (
        reviews.map((item) => (
          <div key={item.id}>
            <Rating count={5} value={item.rating} size={24} edit={false} activeColor="#ffd700" />
            <p>{item.content}</p>
            <div className="mt-2 flex justify-around">
              <Link href={`/${userId}/review-page?id=${item.id}`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
