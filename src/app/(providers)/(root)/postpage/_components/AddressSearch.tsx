'use client';
import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { Place } from '@/types/types';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

type SearchAddressProps = {
  prev: () => void;
  selectedDay: string;
  selectedPlaces: Place[];
  setSelectedPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
};

const AddressSearch = ({ prev, selectedDay, selectedPlaces, setSelectedPlaces }: SearchAddressProps) => {
  const [map, setMap] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [cleanHTML, setCleanHTML] = useState<string>('');
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const position = useCurrentPosition();
  const [selectedSearch, setSelectedSearch] = useState<Place[]>([]);

  // 검색 결과에 적용된 태그 없애기
  useEffect(() => {
    if (selectedPlace) {
      setCleanHTML(DOMPurify.sanitize(selectedPlace.title));
    }
  }, [selectedPlace]);

  // 초기 지도, 마커 보여주기
  useEffect(() => {
    if (!isScriptLoaded || !position) return;
    const initializeMap = () => {
      const mapInstance = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(position.latitude, position.longitude),
        zoom: 15
      });

      const currentMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(position.latitude, position.longitude),
        map: mapInstance
      });

      setMap(mapInstance);
      setMarkers([currentMarker]);
    };
    initializeMap();
  }, [isScriptLoaded, position]);

  // 마커 상태가 업데이트될 때마다 지도에 마커 추가
  useEffect(() => {
    if (map && selectedPlace) {
      // 기존 마커 숨기기
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      const latitude = selectedPlace.latitude;
      const longitude = selectedPlace.longitude;

      // 새로운 위치로 지도 이동 및 마커 추가
      const newCenter = new window.naver.maps.LatLng(latitude, longitude);
      map.setCenter(newCenter);

      const selectedMarker = new window.naver.maps.Marker({
        position: newCenter,
        map: map
      });

      setMarkers([selectedMarker]);
    }
  }, [map, selectedPlace]);

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
      const response = await axios.get('/api/search', {
        params: { query: searchQuery }
      });

      const places = response.data.items.map((item: any) => {
        const latitude = parseFloat(item.mapy) / 1e7;
        const longitude = parseFloat(item.mapx) / 1e7;
        return {
          title: item.title,
          roadAddress: item.roadAddress,
          address: item.address,
          latitude: latitude,
          longitude: longitude
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
      setSelectedSearch((prev) => [...prev, place]);
    }
  };
  // 목록에서 제거 (취소버튼)
  const handlePlaceRemove = (place: Place) => {
    setSelectedSearch((prev) => prev.filter((p) => p !== place));
  };
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

      <div id="map" className="h-2/5 flex-grow"></div>

      {searchResults.length === 0 ? (
        <div className="p-5 text-center">- 검색 결과 -</div>
      ) : (
        <div className="h-1/5 overflow-y-scroll">
          {searchResults.map((place, index) => {
            const cleanHTML = DOMPurify.sanitize(place.title);
            const isSelected = selectedSearch.includes(place);
            return (
              <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
                <div>
                  <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                  <p>{place.roadAddress}</p>
                </div>
                {!isSelected && (
                  <button onClick={() => handlePlaceSelect(place)} className="mt-2 rounded bg-green-500 p-2 text-white">
                    선택
                  </button>
                )}
              </div>
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
                  <p>{place.roadAddress}</p>
                </div>
                <button onClick={() => handlePlaceRemove(place)} className="mt-2 rounded bg-red-500 p-2 text-white">
                  취소
                </button>
              </div>
            );
          })}
      </div>
      <button onClick={handlePlaceSave}>임시 저장</button>
    </div>
  );
};

export default AddressSearch;
