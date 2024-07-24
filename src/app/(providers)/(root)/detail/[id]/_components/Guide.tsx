'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React from 'react';

interface User {
  name: string;
  avatar: string;
}

export const Guide = () => {
  const { id: postId } = useParams() as { id: string };

  // 작성자 데이터를 가져오는 함수
  const fetchUser = async (): Promise<User> => {
    const response = await axios.get(`/api/detail/guide/${postId}`);
    return response.data.user; // response.data에서 user 객체를 반환
  };

  const {
    data: user,
    isLoading,
    error
  } = useQuery<User>({
    queryKey: ['user', postId],
    queryFn: fetchUser,
    enabled: !!postId
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;

  return (
    <div>
      <h3>투어 가이드</h3>
      <div>
        {user && (
          <>
            <img
              src={user.avatar}
              alt={`${user.name}의 아바타`}
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
            <h4>{user.name}</h4>
            <h5>투어 지역은 보류</h5>
          </>
        )}
      </div>
      <button className="mb-6 border">메시지 보내기</button>
    </div>
  );
};
