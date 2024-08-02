'use client';

import React from 'react';
import SelectPost from '../_components/SelectPost';
import SelectUser from '../_components/SelectUser';
import DetailNavbar from '../../../[id]/_components/DetailNavbar';

export default function ReservationPage() {
  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full max-w-[320px]">
          <SelectPost />
          <SelectUser />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
