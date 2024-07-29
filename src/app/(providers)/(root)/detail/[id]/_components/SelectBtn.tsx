import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const SelectBtn = () => {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div>
      <Link href={`/detail/reservation/${postId}`}>
        <button className="border">선택하기</button>
      </Link>
    </div>
  );
};

export default SelectBtn;
