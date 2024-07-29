'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Rating from 'react-rating-stars-component';
import { API_MYPAGE_REVIEWS } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const ReviewForm = ({ userId }: { userId: string }) => {
  const [review, setReview] = useState<Tables<'reviews'>>();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

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

  const handleBack = () => {
    router.back();
  };

  const fetchReview = async () => {
    if (id) {
      const response = await axios.get(`${API_MYPAGE_REVIEWS(userId)}?id=${id}`);
      const reviewData = response.data[0];
      setReview(reviewData);
      setContent(reviewData.content);
      setRating(reviewData.rating);
    }
  };

  const ratingChanged = (newRating: number) => {
    setRating(newRating);
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  return (
    <div>
      <h1>{id ? 'Edit Review' : 'New Review'}</h1>{' '}
      <button className="mt-4" onClick={handleBack}>
        Go Back
      </button>
      <form onSubmit={handleSubmit}>
        <p className="mt-4">별점</p>
        <Rating count={5} value={rating} onChange={ratingChanged} size={24} activeColor="#ffd700" />
        <p className="mt-4">내용</p>
        <input
          className="text-black"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <div className="mt-10 flex max-w-full items-center justify-center">
          <button type="submit">{id ? 'Update Review' : 'Add Review'}</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
