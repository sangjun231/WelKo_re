'use client';
import { useState } from 'react';
import NaverMap from './_components/RegionForm';

export interface CalendarProps {
  next: () => void;
}

function RegionPage() {
  return (
    <div>
      <NaverMap />
    </div>
  );
}
export default RegionPage;
