'use client';

import { Place } from '@/types/types';
import { savePlaces } from '@/utils/post/postData';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

type PlaceProps = {
  next: () => void;
  prev: () => void;
  goToStep4: () => void;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  selectedPlaces: Place[];
  setSelectedPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
};

const DayPlaces: React.FC<PlaceProps> = ({
  next,
  prev,
  goToStep4,
  selectedDay,
  setSelectedDay,
  selectedPlaces,
  setSelectedPlaces
}) => {
  const [region, setRegion] = useState<string | null>(null);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };
  const storedPlaces = sessionStorage.getItem(selectedDay); //선택한 day에 맞는 value값 가져옴
  const keys = Object.keys(sessionStorage);
  const storedPlacesKey = keys.find((key) => sessionStorage.getItem(key) === storedPlaces);

  useEffect(() => {
    if (storedPlaces) {
      if (storedPlacesKey === selectedDay) {
        setSelectedPlaces(JSON.parse(storedPlaces));
      }
    }
  }, [selectedDay]);

  const addMutation = useMutation({
    mutationFn: savePlaces
  });

  const handlePlaceSave = async () => {
    const postId = sessionStorage.getItem('postId');
    if (!postId) {
      console.error('Post ID not found');
      return;
    }
    addMutation.mutate(
      {
        post_id: postId,
        day: selectedDay,
        places: selectedPlaces.map((place) => place.title),
        lat: selectedPlaces.map((place) => place.latitude),
        long: selectedPlaces.map((place) => place.longitude)
      },
      {
        onSuccess: () => {
          alert('장소가 저장되었습니다!');
        },
        onError: (error) => {
          console.error('Error saving places:', error);
          alert('장소 저장에 실패했습니다.');
        }
      }
    );
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
        <div>
          {selectedDay === storedPlacesKey &&
            selectedPlaces.map((place, index) => {
              const cleanHTML = DOMPurify.sanitize(place.title);
              return (
                <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
                  <div>
                    <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                    <p>{place.roadAddress}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {selectedDay === '' ? (
        ''
      ) : (
        <>
          <button onClick={handlePlaceSave} className="my-4 w-full rounded bg-black p-2 text-white">
            {selectedDay === 'day1' && 'Day1 Save'}
            {selectedDay === 'day2' && 'Day2 Save'}
            {selectedDay === 'day3' && 'Day3 Save'}
          </button>
          <button onClick={goToStep4} className="my-4 w-full rounded bg-black p-2 text-white">
            write page
          </button>
        </>
      )}
    </>
  );
};

export default DayPlaces;
