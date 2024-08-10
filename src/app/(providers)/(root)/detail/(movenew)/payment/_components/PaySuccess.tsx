import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import usePostStore from '@/zustand/postStore';
import axios from 'axios';
import { useMyPageStore } from '@/zustand/mypageStore';
import useAuthStore from '@/zustand/bearsStore';
import Link from 'next/link';

export default function PaySuccess() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const txId = searchParams.get('txId');
  const postIdFromParams = searchParams.get('postId');
  const totalAmountFromParams = searchParams.get('totalAmount');
  const router = useRouter();
  const { setPostId, fetchPost, post } = usePostStore((state) => ({
    setPostId: state.setPostId,
    fetchPost: state.fetchPost,
    post: state.post
  }));
  const setSelectedComponent = useMyPageStore((state) => state.setSelectedComponent);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pending, setPending] = useState(true);
  const [isDataSaved, setIsDataSaved] = useState(false);

  useEffect(() => {
    const savePaymentData = async (
      id: string,
      user_id: string,
      post_id: string,
      payment_id: string,
      total_price: number
    ) => {
      try {
        if (isDataSaved) return;

        const response = await axios.post('/api/detail/payment', {
          id,
          user_id,
          post_id,
          pay_state: payment_id,
          total_price
        });
        console.log('Payment data saved:', response.data);
        setPaymentData(response.data);
        setIsDataSaved(true);
      } catch (error) {
        console.error('Error saving payment data:', error);
      } finally {
        setPending(false);
      }
    };

    if (paymentId && txId && postIdFromParams && totalAmountFromParams && !isDataSaved && user?.id) {
      savePaymentData(txId, user.id, postIdFromParams, paymentId, parseFloat(totalAmountFromParams));
    } else {
      setPending(false);
    }
  }, [paymentId, txId, postIdFromParams, totalAmountFromParams, user?.id, isDataSaved]);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        if (!isDataSaved) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 대기
        }
        const response = await axios.get(`/api/detail/payment/${txId}`);
        setPaymentData(response.data);
        if (response.data && response.data.post_id) {
          fetchPost(response.data.post_id);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
      } finally {
        setPending(false);
      }
    };

    if (txId) {
      fetchPaymentData();
    }
  }, [txId, fetchPost, isDataSaved]);

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
      const response = await axios.post(`/api/detail/payment/${txId}`, {
        reason: 'User requested cancel',
        requester: 'CUSTOMER'
      });
      alert(response.data.message);

      if (response.data.success) {
        setSelectedComponent('Reservations');
        router.push(`/${user?.id}/mypage`);
      }
    } catch (error) {
      console.error('Error requesting cancel:', error);
      alert('Cancel request failed.');
    }
  };

  const handleCancelClick = () => {
    const confirmed = window.confirm('Are you sure you want to cancel the payment? This action cannot be undone.');
    if (confirmed) {
      handleCancelRequest();
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
        <h1 className="mb-2 text-2xl font-semibold text-grayscale-900">We’re getting your tour!</h1>
        <p className="text-xs font-normal text-grayscale-600">The payment has been completed.</p>
      </div>
      <div className="mb-40 flex w-full max-w-[320px] flex-col">
        <div
          onClick={handleReservationsClick}
          className="mb-4 w-full cursor-pointer rounded-xl bg-primary-300 px-6 py-3 text-center text-white"
        >
          My Reservation
        </div>
        <Link
          href="/"
          className="mb-4 w-full rounded-xl border border-primary-300 px-6 py-3 text-center text-primary-300"
        >
          Back to Home
        </Link>
      </div>
      <div className="mb-2 text-center text-gray-600">
        Is there a mistake? You can cancel it immediately by pressing the button below
      </div>
      <button onClick={handleCancelClick} className="text-sm font-semibold text-grayscale-900 underline">
        Cancel Now
      </button>
    </div>
  );
}
