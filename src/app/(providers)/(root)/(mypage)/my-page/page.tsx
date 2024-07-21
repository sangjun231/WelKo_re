'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_MYPAGE_REVIEWS } from '@/utils/apiConstants';

type Review = {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  rating: number;
};

const MyPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(API_MYPAGE_REVIEWS);
      setReviews(response.data);
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete(API_MYPAGE_REVIEWS, { data: { id } });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div>
      <h1>My Page</h1>
      <Link href={`/review-page`}>
        <button>Create New Review</button>
      </Link>
      {reviews.length === 0 ? (
        <div>Loading...</div>
      ) : (
        reviews.map((item) => (
          <div key={item.id}>
            <h2>{item.content}</h2>
            <p>Rating: {item.rating}</p>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
            <Link href={`/review-page?id=${item.id}`}>
              <button>Edit</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPage;
