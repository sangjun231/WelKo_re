import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import useAuthStore from '@/zustand/bearsStore'; // Zustand 상태 관리를 위한 Hook
import { useParams } from 'next/navigation';

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!postId || !user?.id) return;

    console.log('postId:', postId); // 로그 출력: postId 확인
    console.log('userId:', user.id); // 로그 출력: userId 확인

    const fetchLike = async () => {
      try {
        const response = await axios.get(`/api/detail/likes/${postId}`, {
          headers: { 'user-id': user.id }
        });
        if (response.status === 200) {
          setLiked(response.data.liked);
        } else {
          console.error('Failed to fetch like status:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchLike();
  }, [postId, user?.id]);

  const handleLike = async () => {
    if (!user) {
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }

    try {
      const newLiked = !liked;
      const response = await axios.post(`/api/detail/likes/${postId}`, {
        userId: user.id,
        liked: newLiked
      });
      if (response.status === 200) {
        setLiked(newLiked); // 서버에서 성공적으로 처리된 후 클라이언트 상태 업데이트
      } else {
        console.error('Failed to process like status:', response.data);
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  return <button onClick={handleLike}>{liked ? <FaHeart size={30} color="red" /> : <FaRegHeart size={30} />}</button>;
};

export default Likes;
