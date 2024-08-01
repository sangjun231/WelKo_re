'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import usePostStore from '@/zustand/postStore';
import axios from 'axios';
import { useMyPageStore } from '@/zustand/mypageStore';
import useAuthStore from '@/zustand/bearsStore';
import Link from 'next/link';

export default function PaymentSuccess() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const router = useRouter();
  const { setPostId, fetchPost, post } = usePostStore((state) => ({
    setPostId: state.setPostId,
    fetchPost: state.fetchPost,
    post: state.post
  }));
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`/api/detail/payment/${id}`);
        setPaymentData(response.data);
        if (response.data && response.data.post_id) {
          fetchPost(response.data.post_id);
        }
        setPending(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setPending(false);
      }
    };

    if (id) {
      fetchPaymentData();
    }
  }, [id, fetchPost]);

  const handleReservationsClick = () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다!!');
      router.push('/login');
      return;
    }
    setSelectedComponent('Reservations');
    router.push(`/${user?.id}/mypage`);
  };

  const handleCancelRequest = async () => {
    try {
      const response = await axios.post(`/api/detail/payment/${id}`, {
        reason: 'User requested cancel',
        requester: 'CUSTOMER'
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error requesting cancel:', error);
      alert('Cancel request failed.');
    }
  };

  if (pending) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-5 flex w-full max-w-[300px] flex-col items-center gap-1">
        <h1 className="text-grayscale-900 mb-2 text-2xl font-semibold">We’re getting your tour!</h1>
        <p className="text-grayscale-600 text-xs font-normal">The payment has been completed.</p>
      </div>
      <div className="mb-40 flex w-full max-w-[320px] flex-col">
        <div
          onClick={handleReservationsClick}
          className="bg-primary-300 mb-4 w-full cursor-pointer rounded-xl px-6 py-3 text-center text-white"
        >
          My Reservation
        </div>
        <Link
          href="/"
          className="border-primary-300 text-primary-300 mb-4 w-full rounded-xl border px-6 py-3 text-center"
        >
          Back to Home
        </Link>
      </div>
      <div className="mb-2 text-center text-gray-600">
        Is there a mistake? You can cancel it immediately by pressing the button below
      </div>
      <button onClick={handleCancelRequest} className="text-grayscale-900 text-sm font-semibold underline">
        Cancel Now
      </button>
    </div>
  );
}
