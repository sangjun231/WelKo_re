'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Review = {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  rating: number;
};

const ReviewPage = () => {
  const [review, setReview] = useState<Review | null>(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchReview = async () => {
      const response = await axios.get(`/api/mypage?id=${id}`);
      const reviewData = response.data[0];
      setReview(reviewData);
      setContent(reviewData.content);
      setRating(reviewData.rating);
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.put('/api/mypage', { id, content, rating });
    router.back();
  };

  const handleDelete = async () => {
    await axios.delete('/api/mypage', { data: { id } });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Review</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="text-black"
        />
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          placeholder="Rating"
          className="text-black"
        />
        <button type="submit">Update Review</button>
      </form>
      <button onClick={handleDelete}>Delete Review</button>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default ReviewPage;
