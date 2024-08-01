'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TourReservationList from './_components/TourReservationList';

const TourReservationListPage = () => {
  const params = useParams();
  const postId = Array.isArray(params.postId) ? params.postId[0] : params.postId;

  return (
    <div>
      <h1>Tour Reservation List Page</h1>
      {postId ? <TourReservationList postId={postId} /> : <div>No Post ID Provided</div>}
    </div>
  );
};

export default TourReservationListPage;
