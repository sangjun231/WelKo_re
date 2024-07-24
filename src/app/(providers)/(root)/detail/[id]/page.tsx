'use client';

import React from 'react';
import Read from './_components/Read';
import { Guide } from './_components/Guide';
import Likes from './_components/Likes';
import Payment from './_components/Payment';
import Reviews from './_components/Reviews';

export default function DetailPage() {
  return (
    <>
      <Likes />
      <Read />
      <Reviews />
      <Guide />
      <Payment />
    </>
  );
}
