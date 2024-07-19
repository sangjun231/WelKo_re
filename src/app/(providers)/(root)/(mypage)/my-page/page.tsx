'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
      const response = await axios.get('/api/mypage');
      setReviews(response.data);
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    await axios.delete('/api/mypage', { data: { id } });
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
