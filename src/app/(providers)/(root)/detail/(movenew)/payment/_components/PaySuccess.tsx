'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import usePostStore from '@/zustand/postStore';
import axios from 'axios';
import { useMyPageStore } from '@/zustand/mypageStore';
import useAuthStore from '@/zustand/bearsStore';
import Link from 'next/link';

export default function PaySuccess() {
  const user = useAuthStore((state) => state.user);
  const { id } = useParams(); // 웹 결제의 경우 id를 사용
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
    const savePaymentData = async () => {
      try {
        if (isDataSaved) return;

        // 결제 데이터를 객체로 묶어서 처리
        const paymentData = {
          id: txId,
          user_id: user?.id,
          post_id: postIdFromParams,
          pay_state: paymentId,
          total_price: parseFloat(totalAmountFromParams || '0')
        };

        // 실제로 데이터 저장 요청에 실패시키기 위해 존재하지 않는 URL로 요청을 보냄
        // await axios.post('/api/non-existent-url', paymentData);

        // 결제 내역을 서버에 저장
        const response = await axios.post('/api/detail/payment', paymentData);
        setPaymentData(response.data);
        setIsDataSaved(true);
      } catch (error) {
        console.error('Error saving payment data:', error);

        try {
          // 결제 데이터 저장 실패 시 자동 환불 처리
          await axios.post(`/api/detail/autocancel`, {
            paymentId,
            reason: 'Data save failed',
            requester: 'CUSTOMER'
          });
          alert('결제 데이터 저장에 실패하여 자동으로 환불 처리되었습니다.');
        } catch (cancelError) {
          console.error('Refund failed:', cancelError);
          alert('결제 데이터 저장에 실패했으며, 환불 처리에도 실패했습니다. 관리자에게 문의하세요.');
        }
        router.push(`/${user?.id}/mypage`);
      } finally {
        setPending(false);
      }
    };

    if (paymentId && txId && postIdFromParams && totalAmountFromParams && !isDataSaved && user?.id) {
      savePaymentData();
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

        // 모바일 결제는 txId를, 웹 결제는 id를 사용하여 데이터 조회
        const response = await axios.get(`/api/detail/payment/${txId || id}`);
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

    if (txId || id) {
      fetchPaymentData();
    }
  }, [txId, id, fetchPost, isDataSaved]);

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
      const response = await axios.post(`/api/detail/payment/${txId || id}`, {
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
    return <div>Loading...</div>;
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
