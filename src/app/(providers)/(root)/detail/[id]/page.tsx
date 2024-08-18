'use client';

import React, { useEffect } from 'react';
import DetailImg from './_components/DetailImg';
import { Guide } from './_components/Guide';
import Reviews from './_components/Reviews';
import { CheckboxDetail } from './_components/CheckboxDetail';
import DetailNavbar from './_components/DetailNavbar';
import ScheduleMap from './_components/ScheduleMap';
import { useWebStore } from '@/zustand/webStateStore';
import DetailRead from './_components/DetailRead';

export default function DetailPage() {
  const { isWeb, setIsWeb } = useWebStore();

  useEffect(() => {
    const handleResize = () => {
      setIsWeb(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsWeb]);

  return (
    <>
      <DetailImg isWeb={isWeb} />
      <div className="flex w-full justify-center">
        <div className="web:mx-[88px] mx-5 w-full">
          <DetailRead isWeb={isWeb} />
          <CheckboxDetail isWeb={isWeb} />
          <ScheduleMap isWeb={isWeb} />
          <Guide isWeb={isWeb} />
          <Reviews isWeb={isWeb} />
        </div>
      </div>
      <DetailNavbar />
    </>
  );
}
