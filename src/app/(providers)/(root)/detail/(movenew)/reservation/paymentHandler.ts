// reservation/paymentHandler.ts
import axios from 'axios';
import { PaymentRequest } from '@/types/pay';
import * as PortOne from '@portone/browser-sdk/v2';

const handlePaymentSuccess = async (response: any, user: any, post: any, totalAmount: number, router: any) => {
  try {
    const paymentData = {
      id: response.txId, // 고유 트랜잭션 ID
      user_id: user?.id, // 로그인한 사용자 ID
      post_id: post.id, // 결제한 게시물 ID
      pay_state: response.paymentId, // 결제 서비스 제공자에서 생성한 고유 결제 ID
      total_price: totalAmount // 총 결제 금액
    };

    await axios.post('/api/detail/payment', paymentData);

    router.push(`/detail/payment/${response.txId}`);
  } catch (error) {
    console.error('Error saving payment data:', error); // 클라이언트 에러 로그 출력
  }
};

const handlePaymentFail = (error: any) => {
  console.error('Payment Failed:', error);
};

export const initiatePayment = (user: any, post: any, totalAmount: number, router: any) => {
  const requestData: PaymentRequest = {
    storeId: process.env.NEXT_PUBLIC_POSTONE_STORE_ID || '', // 스토어 아이디
    paymentId: `payment${crypto.randomUUID().split('-')[0]}`, // 고객사 주문 고유 번호
    orderName: post.title, // 주문명
    channelKey: process.env.NEXT_PUBLIC_POSTONE_KG_CHANNEL_KEY || '', // 채널 키
    totalAmount: totalAmount, // 결제 금액
    currency: 'CURRENCY_KRW', // 결제 통화
    payMethod: 'CARD', // 결제수단 구분코드
    customer: {
      fullName: user?.name || 'Unknown', // 구매자 전체 이름
      phoneNumber: user?.phone || '010-0000-0000', // 구매자 연락처
      email: user?.email || 'test@portone.io' // 구매자 이메일
    },
    bypass: {
      inicis_v2: {
        logo_url: 'https://portone.io/assets/portone.87061e94.avif', // 결제창에 삽입할 메인 로고 url
        logo_2nd: 'https://admin.portone.io/assets/img/auth/lock.png', // 결제창에 삽입할 서브 로고 url
        parentemail: 'parentemail', // 보호자 이메일 주소
        Ini_SSGPAY_MDN: '01012341234', // SSGPAY 결제요청 시 PUSH 전송 휴대폰번호
        acceptmethod: ['SKIN(#C1272C)', 'below1000'], // 결제창 색상 및 1000원 미만 결제 허용 옵션
        P_CARD_OPTION: 'selcode=14',
        P_MNAME: '포트원', // 결제 페이지에 표시될 가맹점 이름 지정
        P_RESERVED: ['below1000=Y', 'noeasypay=Y'] // 1000원 미만 결제 허용 옵션 및 간편결제 미노출 옵션
      }
    },
    onPaymentSuccess: (response) => handlePaymentSuccess(response, user, post, totalAmount, router),
    onPaymentFail: handlePaymentFail,
    locale: 'EN_US' // 예시: 결제창 언어 설정
  };

  PortOne.requestPayment(requestData);
};
