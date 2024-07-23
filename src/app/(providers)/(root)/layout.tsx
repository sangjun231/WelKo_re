import UpButton from '@/components/common/Button/UpButton';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PropsWithChildren } from 'react';

function RootLayout({ children }: PropsWithChildren) {
  return (
    <div id="root" className="flex flex-col max-w-[1440px] sm:max-w-[360] min-h-screen mx-auto">
      <div className="flex flex-1 gap-4">
        <main className="flex-1 p-6">
          {children}
          <UpButton />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
