'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/zustand/auth';

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useUserStore((state) => state.user);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!postId || !user?.id) return;

    const fetchLike = async () => {
      try {
        const response = await axios.get(`/api/detail/likes/${postId}`, {
          headers: {
            'user-id': user.id // 서버에서 userId를 사용하여 상태를 가져오도록 설정
          }
        });
        console.log('Like status response:', response.data); // 응답 확인
        setLiked(response.data.liked);
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchLike();
  }, [postId, user?.id]);

  const handleLike = async () => {
    if (!user?.id) {
      // user가 정의되어 있는지, id가 있는지 확인
      console.error('User is not logged in');
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }

    try {
      const newLiked = !liked;
      const url = `/api/detail/likes/${postId}`;
      if (newLiked) {
        await axios.post(url, { userId: user.id }); // 좋아요 추가
      } else {
        await axios.delete(url, {
          data: { userId: user.id } // 좋아요 제거
        });
      }
      setLiked(newLiked);
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLike}>{liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}</button>
    </div>
  );
};

export default Likes;
