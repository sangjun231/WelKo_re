import React from 'react';

const DetailNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-white">
      <hr className="bg-grayscale-100 mx-auto h-[1px] w-full max-w-[360px]" />
      <div className="mx-auto flex max-w-[320px] items-center justify-between py-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center text-lg">
            <span className="text-primary-300 font-semibold">$50</span>
            <span className="text-grayscale-600 font-medium">/Person</span>
          </div>
          <div className="flex justify-start">
            <p className="text-grayscale-900 text-xs font-medium">24.8.19 - 8.22</p>
          </div>
        </div>
        <button className="bg-primary-300 w-40 rounded-xl px-4 py-2 text-white">Reserve</button>
      </div>
    </div>
  );
};

export default DetailNavbar;
