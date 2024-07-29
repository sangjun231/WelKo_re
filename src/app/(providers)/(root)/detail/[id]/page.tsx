'use client';

import React from 'react';
import Read from './_components/Read';
import { Guide } from './_components/Guide';
import Likes from './_components/Likes';
import SelectBtn from './_components/SelectBtn';
import Reviews from './_components/Reviews';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id; // URL에서 id를 가져옴

  return (
    <>
      <Likes />
      <Read />
      <Guide />
      <Reviews />
      <SelectBtn />
    </>
  );
}
