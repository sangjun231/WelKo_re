'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { API_MYPAGE_REVIEWS } from '@/utils/apiConstants';

type Review = {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  rating: number;
};

const ReviewForm = ({ userId }: { userId: string }) => {
  const [review, setReview] = useState<Review | null>(null);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        const response = await axios.get(`${API_MYPAGE_REVIEWS(userId)}?id=${id}`);
        const reviewData = response.data[0];
        setReview(reviewData);
        setContent(reviewData.content);
        setRating(reviewData.rating);
      }
    };

    fetchReview();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (id) {
      await axios.put(API_MYPAGE_REVIEWS(userId), { id, content, rating });
    } else {
      const postId = uuidv4();
      await axios.post(API_MYPAGE_REVIEWS(userId), { content, rating, post_id: postId, user_id: userId });
    }
    router.back();
  };

  const handleDelete = async () => {
    if (id) {
      await axios.delete(API_MYPAGE_REVIEWS(userId), { data: { id } });
      router.back();
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1>{id ? 'Edit Review' : 'New Review'}</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{id ? 'Update Review' : 'Add Review'}</button>
      </form>
      {id && <button onClick={handleDelete}>Delete Review</button>}
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default ReviewForm;
