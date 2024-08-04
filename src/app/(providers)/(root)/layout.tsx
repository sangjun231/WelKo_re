import UpButton from '@/components/common/Button/UpButton';
import Navbar from '@/components/common/Navbar/Navbar';
import { PropsWithChildren, Suspense } from 'react';
import RouteChangeHandler from './(mainpage)/_components/RouteChangeHandler';

function RootLayout({ children }: PropsWithChildren) {
  return (
    <div id="root" className="mx-auto flex min-h-screen max-w-[1440px] flex-col sm:max-w-[360px]">
      <Suspense fallback={<div>Loading...</div>}>
        <RouteChangeHandler />
      </Suspense>
      <div className="flex flex-1 gap-4">
        <main className="flex-1">
          {children}
          <UpButton />
        </main>
      </div>
      <Navbar />
    </div>
  );
}

export default RootLayout;
