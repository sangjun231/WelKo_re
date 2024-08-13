'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Image from 'next/image';
import { API_MYPAGE_TOURRESERVATIONLIST } from '@/utils/apiConstants';
import { Tables } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { formatDateRange } from '@/utils/detail/functions';

const fetchReservations = async (userId: string, postId: string) => {
  const response = await axios.get(API_MYPAGE_TOURRESERVATIONLIST(userId, postId));
  return response.data;
};

const TourReservationList = ({ userId, postId }: { userId: string; postId: string }) => {
  const router = useRouter();

  const { data, error, isLoading } = useQuery<
    (Tables<'payments'> & {
      users: { id: string; email: string; name: string; avatar: string };
      posts: {
        id: string;
        user_id: string | null;
        title: string;
        image: string | null;
        price: number | null;
        startDate: string | null;
        endDate: string | null;
      };
    })[]
  >({
    queryKey: ['reservations', userId, postId],
    queryFn: () => fetchReservations(userId, postId),
    enabled: !!userId && !!postId
  });

  const formatPrice = (price: number | null): string => {
    if (price === null) {
      return 'N/A';
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleChat = (
    post: { id: string; user_id: string | null; title: string; image: string | null },
    postAuthorId: string
  ) => {
    const query = new URLSearchParams({
      postId: post.id,
      postTitle: post.title || '',
      postImage: post.image || ''
    }).toString();
    router.push(`/${userId}/${postAuthorId}/chatpage?${query}`);
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading reservations</div>;

  if (!data || data.length === 0) return <div>No reservations found</div>;

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <button className="rounded-[24px] bg-grayscale-50" onClick={handleBack}>
          <Image src="/icons/tabler-icon-chevron-left.svg" alt="Go Back" width={32} height={32} />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 transform text-[18px] font-semibold">Reservation List</p>
        <div className="w-8"></div>
      </div>
      <div className="mt-[24px] flex">
        <Image
          className="rounded-[8px]"
          src={data[0].posts.image || '/default-image.png'}
          alt={data[0]?.posts.title}
          width={80}
          height={80}
          style={{ width: '80px', height: '80px' }}
        />
        <div className="ml-[8px]">
          <p className="line-clamp-1 text-[14px] font-semibold">{data[0]?.posts.title}</p>
          <p className="text-[14px] text-grayscale-500">
            {formatDateRange(data[0]?.posts.startDate, data[0]?.posts.endDate)}
          </p>
          <p className="text-[13px] font-medium text-gray-700">
            <span className="font-semibold text-primary-300">{formatPrice(data[0]?.posts.price)}</span>
            /Person
          </p>
        </div>
      </div>
      <div>
        {data.map((reservation) => (
          <div className="my-[20px] border-b pb-[20px]" key={reservation.id}>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Number</span>
              <span className="flex-grow text-left">{reservation.id}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Nickname</span>
              <span className="flex-grow text-left">{reservation.users.name}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Email</span>
              <span className="flex-grow text-left">{reservation.users.email}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Date</span>
              <span className="flex-grow text-left">{new Date(reservation.created_at).toLocaleString()}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Tourist</span>
              <span className="flex-grow text-left">{reservation.people}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">Amount</span>
              <span className="flex-grow text-left">{formatPrice(reservation.total_price)}</span>
            </div>
            <div className="mb-[16px] flex flex-col gap-[8px] text-[14px]">
              <span className="min-w-[80px] text-[12px] text-grayscale-500">State</span>
              <span className="flex-grow text-left">{reservation.pay_state}</span>
            </div>
            <button
              className="w-full rounded-lg border p-2 text-[14px] font-semibold text-grayscale-700"
              onClick={() => handleChat(reservation.posts, reservation.users.id)}
            >
              Message Tourist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourReservationList;
