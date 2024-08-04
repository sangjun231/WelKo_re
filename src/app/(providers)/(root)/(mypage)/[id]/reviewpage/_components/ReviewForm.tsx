'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Rating from 'react-rating-stars-component';
import { API_POST_DETAILS, API_MYPAGE_REVIEWS } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const ReviewForm = ({ userId }: { userId: string }) => {
  const [review, setReview] = useState<Tables<'reviews'>>();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [post, setPost] = useState<Tables<'posts'>>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const postId = searchParams.get('post_id');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (id) {
      await axios.put(API_MYPAGE_REVIEWS(userId), { id, content, rating });
    } else {
      await axios.post(API_MYPAGE_REVIEWS(userId), { content, rating, post_id: postId, user_id: userId });
    }
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const fetchReview = async () => {
    if (id) {
      const response = await axios.get(`${API_MYPAGE_REVIEWS(userId)}?id=${id}&post_id=${postId}`);
      const reviewData = response.data[0];
      setReview(reviewData);
      setContent(reviewData.content);
      setRating(reviewData.rating);

      if (reviewData.post_id) {
        fetchPost(reviewData.post_id);
      }
    }
  };

  const fetchPost = async (post_id: string) => {
    const response = await axios.get(API_POST_DETAILS(post_id));
    const postData: Tables<'posts'> = response.data;
    setPost(postData);
  };

  useEffect(() => {
    fetchReview();

    if (postId) {
      fetchPost(postId);
    }
  }, [id, postId]);

  const ratingChanged = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="mt-[56px]">
      <div className="relative flex items-center justify-between">
        <button className="rounded-[24px] bg-grayscale-50" onClick={handleBack}>
          <Image src="/icons/tabler-icon-chevron-left.svg" alt="Go Back" width={32} height={32} />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 transform text-[18px] font-semibold">
          {id ? 'Edit Review' : 'New Review'}
        </p>
        <div className="w-8"></div>
      </div>
      <div className="my-[20px]">
        {post ? (
          <div className="flex">
            <Image
              src={post.image ?? '/icons/upload.png'}
              alt={post.title ?? 'Default title'}
              width={44}
              height={44}
              style={{ width: '44px', height: '44px' }}
            />
            <div className="ml-[8px] flex flex-col">
              <p className="text-[14px] font-semibold">{post.title}</p>
              <p className="text-[14px] text-grayscale-500">
                {post.startDate ? new Date(post.startDate).toLocaleDateString() : 'No start date available'} -
                {post.endDate ? new Date(post.endDate).toLocaleDateString() : 'No end date available'}
              </p>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <Rating key={rating} count={5} value={rating} onChange={ratingChanged} size={24} activeColor="#ffd700" />
        <textarea
          className="mt-[20px] h-[225px] w-full resize-none rounded-2xl border bg-grayscale-50 p-[16px] text-[14px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="You can write up to 500 characters"
        />
        <button
          className="mt-[12px] w-full rounded-xl border bg-primary-300 px-[20px] py-[12px] text-[16px] font-semibold text-white"
          type="submit"
        >
          {id ? 'Update Review' : 'Add Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
