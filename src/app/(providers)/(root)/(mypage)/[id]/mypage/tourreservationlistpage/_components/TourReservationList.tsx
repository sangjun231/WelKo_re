'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Image from 'next/image';
import { API_MYPAGE_TOURRESERVATIONLIST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';

const fetchReservations = async (userId: string, postId: string) => {
  const response = await axios.get(API_MYPAGE_TOURRESERVATIONLIST(userId, postId));
  return response.data;
};

const TourReservationList = ({ userId, postId }: { userId: string; postId: string }) => {
  const { data, error, isLoading } = useQuery<
    (Tables<'payments'> & {
      users: { email: string; name: string; avatar: string };
      posts: { title: string; image: string };
    })[]
  >({
    queryKey: ['reservations', userId, postId],
    queryFn: () => fetchReservations(userId, postId),
    enabled: !!userId && !!postId
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading reservations</div>;

  if (!data || data.length === 0) return <div>No reservations found</div>;

  return (
    <div>
      <div className="mt-4 flex">
        <Image src={data[0].posts.image} alt={data[0]?.posts.title} width={50} height={50} />
        <p className="ml-2 font-bold">Tour Title: {data[0]?.posts.title}</p>
      </div>
      <ul>
        {data.map((reservation) => (
          <li className="my-10" key={reservation.id}>
            <Image src={reservation.users.avatar} alt={reservation.users.name} width={50} height={50} />
            <p>Name: {reservation.users.name}</p>
            <p>Email: {reservation.users.email}</p>
            <p>Reserved At: {new Date(reservation.created_at).toLocaleString()}</p>
            <p>Total Participants: {reservation.people}</p>
            <p>Total Price: {reservation.total_price}</p>
            <p>Payment State: {reservation.pay_state}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourReservationList;
