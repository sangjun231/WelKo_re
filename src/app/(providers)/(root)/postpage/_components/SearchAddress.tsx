'use client';
import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

type SearchAddressProps = {
  prev: () => void;
  onSave: (place: Place) => void;
};

type Place = {
  title: string;
  roadAddress: string;
  address: string;
  latitude: number;
  longitude: number;
};

const SearchAddress = ({ prev, onSave }: SearchAddressProps) => {
  const [map, setMap] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [cleanHTML, setCleanHTML] = useState<string>('');
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const position = useCurrentPosition();

  //검색 결과에 적용된 태그 없애기
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
      setMarkers(currentMarker);
    };
    initializeMap();
  }, [isScriptLoaded, position]);

  // 검색 api를 불러와 장소 검색하기 (주소 아님)
  const searchPlaces = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get('/api/search', {
        params: { query: searchQuery }
      });

      const places = response.data.items.map((item: any) => ({
        title: item.title,
        roadAddress: item.roadAddress,
        address: item.address,
        latitude: parseFloat(item.mapy),
        longitude: parseFloat(item.mapx)
      }));

      setSearchResults(places); // 검색 결과를 배열로 설정
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    markers.forEach((marker) => marker.setVisible(false)); // 기존 마커 숨기기
    setMarkers([]);
    // 새로운 위치로 지도 이동 및 마커 추가
    const newCenter = new window.naver.maps.LatLng(place.latitude, place.longitude);
    map.setCenter(newCenter);

    const selectedMarker = new window.naver.maps.Marker({
      position: newCenter,
      map: map
    });
    setMarkers([selectedMarker]);
  };

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

      <div id="map" className="flex-grow"></div>

      <div className="h-1/3 overflow-y-auto">
        {searchResults.map((place, index) => {
          const cleanHTML = DOMPurify.sanitize(place.title);
          return (
            <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
              <div>
                <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                <p>{place.roadAddress}</p>
              </div>
              {place === selectedPlace ? (
                <button className="mt-2 rounded border-2 bg-white p-2">취소</button>
              ) : (
                <button onClick={() => handlePlaceSelect(place)} className="mt-2 rounded bg-green-500 p-2 text-white">
                  선택
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchAddress;
