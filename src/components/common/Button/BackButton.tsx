import React from 'react';
import { IoChevronBack } from 'react-icons/io5';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  return (
    <div className={`icon-button ${className}`}>
      <button onClick={() => window.history.back()} className="flex h-full w-full items-center justify-center">
        <IoChevronBack size={24} />
      </button>
    </div>
  );
};

export default BackButton;
