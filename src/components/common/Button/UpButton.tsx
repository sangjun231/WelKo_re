'use client';
import { useEffect, useState } from 'react';

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
      <button onClick={goToTop} className="fixed bottom-16 right-4 rounded-full bg-blue-500 p-2 text-white shadow-lg">
        UP
      </button>
      <button className="fixed bottom-4 right-4 rounded-full bg-black p-2 text-white shadow-lg">post</button>
    </div>
  ) : (
    <button className="fixed bottom-4 right-4 rounded-full bg-black p-2 text-white shadow-lg">post</button>
  );
}
export default UpButton;
