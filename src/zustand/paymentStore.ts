import { create } from 'zustand';
import * as PortOne from '@portone/browser-sdk/v2';

// PaymentResponse 타입 수동 정의
interface PaymentResponse {
  code?: string;
  txId?: string;
  paymentId?: string;
  // 필요한 다른 필드도 여기에 추가 가능
}

// Zustand 상태 정의
interface PaymentState {
  totalAmount: number;
  txId: string | null;
  paymentId: string | null;
  setTotalAmount: (amount: number) => void;
  setTxId: (txId: string) => void;
  setPaymentId: (paymentId: string) => void;
}

// Zustand 스토어 생성
export const usePaymentStore = create<PaymentState>((set) => ({
  totalAmount: 0,
  txId: null,
  paymentId: null,
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  setTxId: (txId) => {
    console.log('Setting txId:', txId); // 로그 추가
    set({ txId });
  },
  setPaymentId: (paymentId) => {
    console.log('Setting paymentId:', paymentId); // 로그 추가
    set({ paymentId });
  }
}));

// 결제 요청 함수
export function initiatePayment(
  post: any,
  user: any,
  totalAmountInCents: number,
  isMobile: boolean,
  redirectUrl: string
): Promise<PaymentResponse | undefined> {
  return PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '',
    channelKey: process.env.NEXT_PUBLIC_POSTONE_KG_CHANNEL_KEY || '',
    paymentId: `payment${crypto.randomUUID().split('-')[0]}`,
    orderName: post.title,
    totalAmount: totalAmountInCents,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
    customer: {
      fullName: user?.name || 'Unknown',
      phoneNumber: user?.phone || '010-0000-0000',
      email: user?.email || 'test@portone.io'
    },
    bypass: isMobile
      ? {
          inicis_v2: {
            P_CARD_OPTION: 'selcode=14',
            P_MNAME: '포트원',
            P_RESERVED: ['below1000=Y', 'noeasypay=Y', 'global_visa3d=Y', 'apprun_check=Y']
          }
        }
      : {
          inicis_v2: {
            logo_url: 'https://portone.io/assets/portone.87061e94.avif',
            logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png',
            parentemail: 'parentemail',
            Ini_SSGPAY_MDN: '01012341234',
            acceptmethod: ['SKIN(#BA68C8)', 'below1000', 'noeasypay'],
            P_CARD_OPTION: 'selcode=14',
            P_MNAME: '포트원',
            P_RESERVED: ['below1000=Y', 'noeasypay=Y']
          }
        },
    locale: 'EN_US',
    redirectUrl
  });
}

// 전역 상태를 사용하는 결제 처리 함수
export const requestPayment = async (
  post: any,
  user: any,
  totalAmount: number,
  handlePaymentSuccess: (response: any) => Promise<void>,
  handlePaymentFailure: (error: any) => Promise<void>,
  redirectUrl: string // DetailNavbar에서 전달된 URL
) => {
  const { setTxId, setPaymentId } = usePaymentStore.getState();
  const totalAmountInCents = totalAmount * 1000;

  // 사용자가 모바일인지 확인
  const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);

  try {
    // 결제 요청 함수 호출
    const response = await initiatePayment(post, user, totalAmountInCents, isMobile, redirectUrl);

    console.log('Payment response:', response);

    if (response?.code != null) {
      await handlePaymentFailure(response);
    } else {
      const { txId, paymentId } = response || {};
      console.log('Received txId:', txId);
      console.log('Received paymentId:', paymentId);

      if (!txId || !paymentId) {
        throw new Error('txId 또는 paymentId가 없습니다.');
      }

      // 전역 상태에 txId와 paymentId 저장
      setTxId(txId);
      setPaymentId(paymentId);

      const finalRedirectUrl = `${redirectUrl}/${txId}`;
      console.log('Generated URL in PaymentStore:', finalRedirectUrl);

      // 최종적으로 리디렉션 URL을 포함한 성공 처리를 호출
      await handlePaymentSuccess({ ...response, redirectUrl: finalRedirectUrl });
    }
  } catch (error) {
    console.error('Payment request error:', error);
    alert('결제 요청 중 오류가 발생했습니다.');
  }
};

export default usePaymentStore;
