'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoIosArrowRoundUp } from 'react-icons/io';

function UpButton() {
  const [toggleButton, setToggleButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState('bottom-32 right-3');
  const pathname = usePathname();

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const { scrollY } = window;
      scrollY > 200 ? setToggleButton(true) : setToggleButton(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pathname.startsWith('/detail')) {
        setButtonPosition('bottom-20 right-3'); // detail 페이지에서의 위치
      } else {
        setButtonPosition('bottom-32 right-3'); // 기본 위치
      }

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [pathname]);

  const goToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return toggleButton ? (
    <button
      onClick={goToTop}
      className={`fixed ${buttonPosition} flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white`}
    >
      <IoIosArrowRoundUp className="size-8" />
    </button>
  ) : null;
}

export default UpButton;
