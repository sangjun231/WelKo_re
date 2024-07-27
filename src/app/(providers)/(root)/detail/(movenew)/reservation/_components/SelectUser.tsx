'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import { initiatePayment } from '../paymentHandler';

const SelectUser = () => {
  const user = useAuthStore((state) => state.user);
  const post = usePostStore((state) => state.post);
  const router = useRouter();
  const [result, _] = useState<any>(null);
  const [numPersons, setNumPersons] = useState(1);
  const [totalAmount, setTotalAmount] = useState(post ? post.price : 0);

  useEffect(() => {
    if (post) {
      setTotalAmount(post.price * numPersons);
    }
  }, [numPersons, post]);

  if (!post) return <div>Loading...</div>;

  const handleNumPersonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumPersons(value > 0 ? value : 1); // 최소값을 1로 설정
  };

  const handlePaymentClick = () => {
    const totalAmountInCents = totalAmount * 100;
    initiatePayment(user, post, totalAmountInCents, router);
  };

  return (
    <div>
      <div>
        <h3 className="font-bold">예약 인원</h3>
        <input
          type="number"
          className="my-6 w-16 border-b-2 p-1"
          min="1"
          value={numPersons}
          onChange={handleNumPersonsChange}
        />
        명<h5>투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. </h5>
      </div>
      <div>
        <h3 className="font-bold">예약자 정보</h3>
        <div className="border">{user ? user.email : '로그인 정보가 없습니다.'}</div>
      </div>
      <div>
        <h3 className="font-bold">예약 약관</h3>
        <h5>
          투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. 투어 인원을 초과한
          경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. 투어 인원을 초과한 경우 예약이 취소될
          수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다.
        </h5>
      </div>
      <div>
        <h3 className="font-bold">전체 금액</h3>
        <p className="font-bold">${totalAmount.toFixed(2)}</p>
      </div>
      <div>
        <button className="border" onClick={handlePaymentClick}>
          결제하기
        </button>
      </div>
      {result && <div>결제 결과: {JSON.stringify(result)}</div>}
    </div>
  );
};

export default SelectUser;
