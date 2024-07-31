import React from 'react';
import { IoChevronBack } from 'react-icons/io5';

const BackButton = () => {
  return (
    <div className="bg-grayscale-50 border-grayscale-50 flex h-8 w-8 items-center justify-center rounded-full border">
      <button onClick={() => window.history.back()} className="flex h-full w-full items-center justify-center">
        <IoChevronBack size={24} />
      </button>
    </div>
  );
};

export default BackButton;
