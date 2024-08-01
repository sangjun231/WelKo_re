'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { API_MYPAGE_TOURRESERVATIONLIST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const fetchReservations = async (postId: string) => {
  const response = await axios.get(API_MYPAGE_TOURRESERVATIONLIST(postId));
  return response.data;
};

const TourReservationList = ({ postId }: { postId: string }) => {
  const { data, error, isLoading } = useQuery<Tables<'payments'>[]>({
    queryKey: ['reservations', postId],
    queryFn: () => fetchReservations(postId),
    enabled: !!postId
  });

  console.log(data?.user_id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reservations</div>;
  if (!data || data.length === 0) return <div>No reservations found</div>;

  return (
    <div className="reservation-list">
      <h1>Reservation List for Post {postId}</h1>
      <ul>
        {data.map((reservation) => (
          <li key={reservation.id}>
            <p>User ID: {reservation.user_id}</p>
            <p>Reserved At: {new Date(reservation.created_at).toLocaleString()}</p>
            <p>Total Price: {reservation.total_price}</p>
            <p>Payment State: {reservation.pay_state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourReservationList;
