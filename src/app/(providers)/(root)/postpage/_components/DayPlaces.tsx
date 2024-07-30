'use client';

import { Place } from '@/types/types';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

type PlaceProps = {
  next: () => void;
  prev: () => void;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  selectedPlaces: Place[];
};

const DayPlaces: React.FC<PlaceProps> = ({ next, prev, selectedDay, setSelectedDay, selectedPlaces }) => {
  const [region, setRegion] = useState<string | null>(null);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <>
      <div className="flex">
        <button onClick={prev}>
          <FaArrowLeft className="m-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold">장소 추가</h1>
          <p>날짜별 일정 추가</p>
        </div>
      </div>
      <div className="flex justify-between">{region && <p>현재 위치: {region}</p>}</div>

      {/*<div id="map" style={{ width: '100%', height: '200px' }}></div>*/}
      <div>
        <div className="flex">
          <div>
            <button className="border-gray rounded-full border-2 p-2" onClick={() => handleDaySelect('day1')}>
              Day 1
            </button>
          </div>

          <button className="border-gray rounded-full border-2 p-2" onClick={() => handleDaySelect('day2')}>
            Day 2
          </button>
          <button className="border-gray rounded-full border-2 p-2" onClick={() => handleDaySelect('day3')}>
            Day 3
          </button>
        </div>

        <hr className="m-3" />
        {selectedDay === '' ? (
          <button className="border-gray cursor-default rounded-full border-2 p-2">Please select a day</button>
        ) : (
          <button className="border-gray rounded-full border-2 p-2" onClick={next}>
            {selectedDay === 'day1' && 'Day1 Add Address'}
            {selectedDay === 'day2' && 'Day2 Add Address'}
            {selectedDay === 'day3' && 'Day3 Add Address'}
          </button>
        )}
        <div></div>
      </div>

      <button className="my-4 w-full rounded bg-black p-2 text-white">저장하기</button>
    </>
  );
};

export default DayPlaces;
