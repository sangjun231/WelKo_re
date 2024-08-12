'use client';

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import usePaymentStore from '@/zustand/paymentStore';

const SelectUser = () => {
  const user = useAuthStore((state) => state.user);
  const post = usePostStore((state) => state.post);
  const { totalAmount, setTotalAmount } = usePaymentStore((state) => ({
    totalAmount: state.totalAmount,
    setTotalAmount: state.setTotalAmount
  }));
  const [numPersons, setNumPersons] = useState(1);

  useEffect(() => {
    if (post) {
      setTotalAmount(post.price * numPersons);
    }
  }, [numPersons, post, setTotalAmount]);

  // 예약 인원 입력 필드 변경 시 호출되는 함수
  const handleNumPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumPersons(value > 0 ? value : 1); // 최소 예약 인원은 1명
  };

  return (
    <div className="mt-6 flex flex-col">
      <div className="mb-5 gap-2">
        <h3 className="text-base font-medium text-text-color">How many tourists?</h3>
        <input
          type="number"
          className="my-2 w-full rounded-xl bg-grayscale-50 px-4 py-3"
          min="1"
          value={numPersons}
          onChange={handleNumPersonsChange}
        />
        <p className="text-[10px] text-grayscale-500">
          If you exceed the number of people booked, your reservation may be canceled. Please contact the guide first.
        </p>
      </div>
      <div className="mb-5 gap-2">
        <h3 className="text-base font-medium text-text-color">Nickname/email</h3>
        <div className="my-2 w-full rounded-xl bg-grayscale-100 px-4 py-3">{user.email}</div>
      </div>
      <div className="m6-5">
        <h3 className="mb-1 text-base font-medium text-text-color">Cancellation Policy</h3>
        <p className="text-xs font-normal text-grayscale-500">
          Before you book, make sure you&apos;re comfortable with
          <u className="text-grayscale-900">this guide&apos;s cancellation policy.</u> If you want a refund, click the
          Request for a <u className="text-grayscale-900">refund button</u> and you will get a refund right away. The
          refund amount will be refunded before 12 o&apos;clock on the same day. You can cancel it for free up to two
          days after payment. After that, there will be a <u className="text-grayscale-900">cancellation penalty.</u>
        </p>
      </div>
    </div>
  );
};

export default SelectUser;
