'use client';

import React, { useEffect, useState } from 'react';
import useAuthStore from '@/zustand/bearsStore';
import * as PortOne from '@portone/browser-sdk/v2';
import usePostStore from '@/zustand/postStore';

interface RequestData {
  uiType: 'PAYPAL_SPB';
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'CURRENCY_USD';
  payMethod: 'paypal';
  windowType: { type: 'UI' };
}

const SelectUser = () => {
  const { user } = useAuthStore();
  const post = usePostStore((state) => state.post);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (post) {
      const requestData: RequestData = {
        uiType: 'PAYPAL_SPB',
        storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
        channelKey: process.env.NEXT_PUBLIC_POSTONE_CHANNEL_KEY || '',
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: post.title,
        totalAmount: post.price,
        currency: 'CURRENCY_USD',
        payMethod: 'paypal',
        windowType: { type: 'UI' }
      };

      PortOne.loadPaymentUI(requestData, {
        onPaymentSuccess: (response) => {
          setResult(response);
          console.log('Payment Success:', response);
        },
        onPaymentFail: (error) => {
          console.error('Payment Failed:', error);
        }
      });
    }
  }, [post]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h3 className="font-bold">예약 인원</h3>
        <input type="number" className="my-6 w-16 border-b-2 p-1" min="1" defaultValue="1" />명
        <h5>투어 인원을 초과한 경우 예약이 취소될 수 있습니다. 판매자에게 먼저 문의 후 결제 바랍니다. </h5>
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
      <div className="portone-ui-container" style={{ minHeight: '100px' }}>
        {/* 이곳에 페이팔 버튼이 렌더링됩니다. */}
      </div>
      {result && <div>결제 결과: {JSON.stringify(result)}</div>}
    </div>
  );
};

export default SelectUser;
