'use client';
import { Place } from '@/types/types';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { GrLocation } from 'react-icons/gr';
import { IoIosSearch } from 'react-icons/io';
import { IoChevronBack, IoCloseOutline } from 'react-icons/io5';

type SearchAddressProps = {
  prev: () => void;
  selectedDay: string;
  sequence: number;
};

const AddressSearch = ({ prev, selectedDay, sequence }: SearchAddressProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [cleanHTML, setCleanHTML] = useState<string>('');
  const [selectedSearch, setSelectedSearch] = useState<Place[]>([]);

  // 검색 결과에 적용된 태그 없애기
  useEffect(() => {
    if (selectedPlace) {
      setCleanHTML(DOMPurify.sanitize(selectedPlace.title));
    }
  }, [selectedPlace]);

  useEffect(() => {
    const storedPlaces = sessionStorage.getItem(selectedDay);
    if (storedPlaces) {
      setSelectedSearch(JSON.parse(storedPlaces));
    }
  }, [selectedDay]);

  // 검색 api를 불러와 장소 검색하기 (주소 아님)
  const searchPlaces = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get('/api/post/search', {
        params: { query: searchQuery }
      });

      const places = response.data.items.map((item: any) => {
        const latitude = parseFloat(item.mapy) / 1e7;
        const longitude = parseFloat(item.mapx) / 1e7;
        return {
          title: item.title,
          roadAddress: item.roadAddress.split(' ').slice(0, 2).join(' '),
          address: item.address,
          latitude: latitude,
          longitude: longitude,
          category: item.category
          //.split('>')[1]
        };
      });

      setSearchResults(places); // 검색 결과를 배열로 설정
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }
  };
  const searchValueinit = () => {
    setSearchQuery('');
  };

  // 선택한 장소 목록에 추가 (선택버튼)
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    // if (!selectedSearch.includes(place)) {
    //   if (selectedSearch.length < 4) {
    //     setSelectedSearch((prev) => [...prev, place]);
    //   } else {
    //     alert('You can only select up to 4 places.');
    //   }
    // }
  };
  {
    /* 목록에서 제거 (취소버튼)
  const handlePlaceRemove = (place: Place) => {
    setSelectedSearch((prev) => prev.filter((p) => p !== place));
  };  */
  }
  // 세션에 임시저장
  const handlePlaceSave = () => {
    let sessionPlaces = sessionStorage.getItem(selectedDay);
    let places = sessionPlaces ? JSON.parse(sessionPlaces) : [];

    if (places.length <= sequence) {
      places.length = sequence + 1;
    }
    places[sequence] = selectedPlace;

    // 수정된 배열을 세션 스토리지에 다시 저장합니다.
    sessionStorage.setItem(selectedDay, JSON.stringify(places));
    // setSelectedSearch([]);
    prev();
  };

  const storedPlaces = sessionStorage.getItem(selectedDay);
  const keys = Object.keys(sessionStorage);
  const storedPlacesKey = keys.find((key) => sessionStorage.getItem(key) === storedPlaces);

  return (
    <div className="flex flex-col">
      <div className="my-5 mr-5 flex items-center">
        <div className="flex w-20 justify-center">
          <div className="icon-button">
            <button onClick={prev} className="flex h-full w-full items-center justify-center">
              <IoChevronBack size={24} />
            </button>
          </div>
        </div>

        <div className="flex h-[48px] items-center rounded-xl bg-grayscale-50 px-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Select ${selectedDay} Place`}
            className="h-[48px] w-full bg-grayscale-50 p-4"
          />
          {searchQuery ? (
            <button onClick={searchValueinit}>
              <IoCloseOutline className="size-6 text-grayscale-500" />
            </button>
          ) : (
            <button onClick={searchPlaces}>
              <IoIosSearch className="size-6 text-grayscale-500" />
            </button>
          )}
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="p-5 text-center"></div>
      ) : (
        <div className="h-3/5 overflow-y-scroll">
          {searchResults.map((place, index) => {
            const cleanHTML = DOMPurify.sanitize(place.title);
            return (
              <button
                key={index}
                onClick={() => handlePlaceSelect(place)}
                className="flex w-full flex-row p-4 hover:bg-gray-100 active:bg-gray-100"
              >
                <div className="mr-3 flex size-11 items-center justify-center rounded-lg bg-grayscale-50">
                  <GrLocation className="size-5" />
                </div>

                <div className="flex flex-col items-start">
                  <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                  <div className="flex flex-wrap text-xs text-gray-400">
                    <p>{place.category} •&nbsp;</p>
                    <p className="text-xs text-gray-400">{place.roadAddress}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* <h2 className="p-4 text-lg font-bold">선택한 장소들</h2>
      <div className="h-1/5 overflow-y-scroll">
        {(storedPlacesKey === undefined || selectedDay === storedPlacesKey) &&
          selectedSearch.map((place, index) => {
            const cleanHTML = DOMPurify.sanitize(place.title);
            return (
              <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
                <div>
                  <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                  <div className="flex text-xs text-gray-400">
                    <p>{place.category} •&nbsp;</p>
                    <p className="text-xs text-gray-400">{place.roadAddress}</p>
                  </div>
                </div>
                <button onClick={() => handlePlaceRemove(place)} className="mt-2 rounded bg-red-500 p-2 text-white">
                  취소
                </button>
              </div>
            );
          })}
      </div> */}

      <button
        onClick={handlePlaceSave}
        className="fixed bottom-28 left-0 right-0 mx-auto my-5 h-14 w-[320px] rounded-2xl bg-primary-300 p-2 text-lg font-medium text-white"
      >
        Select
      </button>
    </div>
  );
};

export default AddressSearch;
