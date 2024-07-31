import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/bearsStore';

const SelectBtn = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleButtonClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/detail/reservation/${postId}`);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} className="border">
        선택하기
      </button>
    </div>
  );
};

export default SelectBtn;
