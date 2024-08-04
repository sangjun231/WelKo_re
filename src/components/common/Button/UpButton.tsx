'use client';
import { useEffect, useState } from 'react';
import { IoIosArrowRoundUp } from 'react-icons/io';

function UpButton() {
  const [toggleButton, setToggleButton] = useState(false);
  const handleScroll = () => {
    const { scrollY } = window;
    scrollY > 200 ? setToggleButton(true) : setToggleButton(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return toggleButton ? (
    <div>
      <button
        onClick={goToTop}
        className="fixed bottom-16 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-black bg-white"
      >
        <IoIosArrowRoundUp className="size-8" />
      </button>
    </div>
  ) : null;
}
export default UpButton;
