'use client';

import React from 'react';
import DetailImg from './_components/DetailImg';
import { Guide } from './_components/Guide';
import Reviews from './_components/Reviews';
import { CheckboxDetail } from './_components/CheckboxDetail';
import DetailNavbar from './_components/DetailNavbar';
import ScheduleMap from './_components/ScheduleMap';

export default function DetailPage() {
  return (
    <>
      <DetailImg />
      <div className="web:relative flex w-full justify-center">
        <div className="w-full max-w-[320px]">
          <CheckboxDetail />
          <ScheduleMap />
          <Guide />
          <Reviews />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
