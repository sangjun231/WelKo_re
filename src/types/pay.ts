export interface Customer {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface BypassInicis {
  logo_url: string;
  logo_2nd: string;
  parentemail: string;
  Ini_SSGPAY_MDN: string;
  acceptmethod: string[];
  P_CARD_OPTION: string;
  P_MNAME: string;
  P_RESERVED: string[];
}

export interface PaymentRequest {
  storeId: string;
  paymentId: string;
  orderName: string;
  channelKey: string;
  totalAmount: number;
  currency: 'CURRENCY_KRW' | 'CURRENCY_USD';
  payMethod: 'CARD'; // 결제수단 구분코드
  customer: Customer;
  bypass: {
    inicis_v2: BypassInicis;
  };
  onPaymentSuccess: (response: any) => void;
  onPaymentFail: (error: any) => void;
  locale?: 'KO_KR' | 'EN_US';
}
