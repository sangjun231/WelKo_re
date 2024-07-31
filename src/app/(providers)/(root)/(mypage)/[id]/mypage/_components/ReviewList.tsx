'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Rating from 'react-rating-stars-component';
import { API_MYPAGE_REVIEWS, API_MYPAGE_POST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const ReviewList = ({ userId }: { userId: string }) => {
  const [reviews, setReviews] = useState<Tables<'reviews'>[]>([]);
  const router = useRouter();

  const fetchReviews = async () => {
    const response = await axios.get(API_MYPAGE_REVIEWS(userId));
    setReviews(response.data);
  };

  const getPostsData = async () => {
    try {
      const response = await axios.get(API_MYPAGE_POST(userId));
      const data: Tables<'posts'>[] = response.data;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`HTTP error! status: ${error.response?.status}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const {
    data: posts,
    isPending,
    error
  } = useQuery<Tables<'posts'>[]>({
    queryKey: ['post', userId],
    queryFn: getPostsData,
    enabled: !!userId
  });

  const handleEditReview = (id: string, postId: string) => {
    router.push(`/${userId}/reviewpage?id=${id}&post_id=${postId}`);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(API_MYPAGE_REVIEWS(userId), { data: { id } });
    setReviews(reviews.filter((review) => review.id !== id));
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (error) {
    return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="flex h-screen items-center justify-center">No posts found</div>;
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <div>No reviews found</div>
      ) : (
        posts.map((post) => {
          const review = reviews.find((r) => r.post_id === post.id);
          return (
            review && (
              <div key={post.id} className="mb-4 border-b pb-4">
                <div className="flex">
                  <Image
                    src={post.image ?? '/icons/upload.png'}
                    alt={post.title ?? 'Default title'}
                    width={44}
                    height={44}
                  />
                  <div className="ml-2 flex flex-col">
                    <p className="font-bold">{post.title}</p>
                    <p className="text-[13px]">
                      {post.startDate} -{post.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <Rating count={5} value={review.rating ?? 0} size={24} edit={false} activeColor="#ffd700" />
                    <p className="ml-2 text-[13px]">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <p>{review.content}</p>
                  <div className="mt-2 flex justify-around">
                    <button onClick={() => handleEditReview(review.id, post.id)}>Edit</button>
                    <button onClick={() => handleDelete(review.id)}>Delete</button>
                  </div>
                </div>
              </div>
            )
          );
        })
      )}
    </div>
  );
};

export default ReviewList;
