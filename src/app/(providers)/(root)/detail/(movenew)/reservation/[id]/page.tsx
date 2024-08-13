'use client';

import React from 'react';
import SelectPost from '../_components/SelectPost';
import SelectUser from '../_components/SelectUser';
import DetailNavbar from '../../../[id]/_components/DetailNavbar';

export default function ReservationPage() {
  return (
    <>
      <div className="web:max-w-[1440px] flex w-full max-w-[360px] justify-center">
        <div className="web:max-w-[1200px] w-full max-w-[320px] p-8">
          <SelectPost />
          <SelectUser />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
