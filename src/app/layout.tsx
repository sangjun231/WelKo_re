import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import favicon from "";
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthSubscriber } from '@/components/common/AuthSubscriber';
import LogoutButton from '@/components/common/logoutButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FiestaTour',
  description: '피에스타 투어',
  icons: {
    // icon: favicon.src,
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
      <body className={inter.className}>
        <header>
          <LogoutButton />
        </header>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
