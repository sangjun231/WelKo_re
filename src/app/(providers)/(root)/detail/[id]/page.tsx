'use client';

import React from 'react';
import Read from '../_components/Read';
import { Guide } from '../_components/Guide';
import Likes from '../_components/Likes';

export default function DetailPage() {
  return (
    <>
      <Likes/>
      <Read />
      <Guide/>
    </>
  );
}
