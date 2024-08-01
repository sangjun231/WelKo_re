'use client';

import React from 'react';
import Read from './_components/Read';
import { Guide } from './_components/Guide';
import Reviews from './_components/Reviews';
import { useParams } from 'next/navigation';
import { CheckboxDetail } from './_components/CheckboxDetail';
import DetailNavbar from './_components/DetailNavbar';

export default function DetailPage() {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id; // URL에서 id를 가져옴

  return (
    <>
      <Read />
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[320px]">
          <CheckboxDetail />
          <Guide />
          <Reviews />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
