'use client';
import { Place } from '@/types/types';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

type SearchAddressProps = {
  prev: () => void;
  selectedDay: string;
};

const AddressSearch = ({ prev, selectedDay }: SearchAddressProps) => {
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
  // 선택한 장소 목록에 추가 (선택버튼)
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    if (!selectedSearch.includes(place)) {
      if (selectedSearch.length < 4) {
        setSelectedSearch((prev) => [...prev, place]);
      } else {
        alert('You can only select up to 4 places.');
      }
    }
  };
  {
    /* 목록에서 제거 (취소버튼)
  const handlePlaceRemove = (place: Place) => {
    setSelectedSearch((prev) => prev.filter((p) => p !== place));
  };  */
  }
  // 세션에 임시저장
  const handlePlaceSave = () => {
    sessionStorage.setItem(selectedDay, JSON.stringify(selectedSearch));
    setSelectedSearch([]);
    prev();
  };
  const storedPlaces = sessionStorage.getItem(selectedDay);
  const keys = Object.keys(sessionStorage);
  const storedPlacesKey = keys.find((key) => sessionStorage.getItem(key) === storedPlaces);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center p-4">
        <button onClick={prev} className="mr-4">
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-bold">장소 검색</h1>
      </div>

      <div className="flex items-center p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="장소 검색..."
          className="flex-grow rounded-l border p-2"
        />
        <button onClick={searchPlaces} className="rounded-r bg-blue-500 p-2 text-white">
          <FaSearch />
        </button>
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
                className="flex w-full flex-col border-b p-4 hover:bg-gray-100"
              >
                <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                <div className="flex text-xs text-gray-400">
                  <p>{place.category} •&nbsp;</p>
                  <p className="text-xs text-gray-400">{place.roadAddress}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <h2 className="p-4 text-lg font-bold">선택한 장소들</h2>
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
                {/*<button onClick={() => handlePlaceRemove(place)} className="mt-2 rounded bg-red-500 p-2 text-white">
                  취소
                </button>*/}
              </div>
            );
          })}
      </div>
      <button onClick={handlePlaceSave}>Select</button>
    </div>
  );
};

export default AddressSearch;
