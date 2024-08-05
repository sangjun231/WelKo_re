'use client';

import React from 'react';
import Read from './_components/Read';
import { Guide } from './_components/Guide';
import Reviews from './_components/Reviews';
import { useParams } from 'next/navigation';
import { CheckboxDetail } from './_components/CheckboxDetail';
import DetailNavbar from './_components/DetailNavbar';
import Map from './_components/Map';

export default function DetailPage() {
  const params = useParams();

  return (
    <>
      <Read />
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[320px]">
          <CheckboxDetail />
          <Map/>
          <Guide />
          <Reviews />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
