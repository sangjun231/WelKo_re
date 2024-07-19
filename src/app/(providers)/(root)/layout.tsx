import UpButton from '@/components/common/Button/UpButton';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PropsWithChildren } from 'react';

function RootLayout({ children }: PropsWithChildren) {
  return (
    <div id="root">
      <div>
        <main>
          <Header />
          {children}
          <UpButton />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
