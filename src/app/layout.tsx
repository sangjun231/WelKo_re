import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthSubscriber } from '@/components/common/AuthSubscriber';
import ChatBot from '@/components/ChatBot';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'WelKo',
  description: 'Welcome Korea',
  icons: {
    icon: '/icons/Favicon.png'
  }
};

export default function HTMLLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <AuthSubscriber />
      <body className={montserrat.className}>
        {children}
        <ToastContainer />
        <ChatBot />
      </body>
    </html>
  );
}
