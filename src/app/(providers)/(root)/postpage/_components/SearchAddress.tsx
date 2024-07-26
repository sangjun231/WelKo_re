'use client';
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
  //검색 결과에 적용된 태그 없애기
  useEffect(() => {
    if (selectedPlace) {
      setCleanHTML(DOMPurify.sanitize(selectedPlace.title));
    }
  }, [selectedPlace]);

  //지도 띄우기
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      initializeMap();
    } else {
      loadNaverMapsScript();
    }
  }, []);
  const initializeMap = () => {
    const mapInstance = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(37.5665, 126.978), //서울시청 위경도
      zoom: 15
    });

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(37.5665, 126.978),
      map: map
    });
    setMap(mapInstance);
    // 지도 초기화 시 마커 추가
    if (searchResults.length > 0) {
      displayMarkers(searchResults, mapInstance);
    }
  };

  const loadNaverMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;
    script.onload = initializeMap;
    document.body.appendChild(script);
  };

  // 검색 api를 불러와 장소 검색하기 (주소 아님)
  const searchPlaces = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get('/api/search', {
        params: { query: searchQuery }
      });
      console.log(response);

      const places = response.data.items.map((item: any) => ({
        title: item.title,
        roadAddress: item.roadAddress,
        address: item.address,
        latitude: parseFloat(item.mapy),
        longitude: parseFloat(item.mapx)
      }));

      setSearchResults(places); // 검색 결과를 배열로 설정
      displayMarkers(places, map);
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const displayMarkers = (places: Place[], mapInstance: any) => {
    if (!mapInstance) {
      console.error('Map object is not initialized');
      return;
    }

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers = places.map((place) => {
      const position = new window.naver.maps.LatLng(place.latitude, place.longitude);
      const marker = new window.naver.maps.Marker({
        position: position,
        map: map
      });

      window.naver.maps.Event.addListener(marker, 'click', () => handlePlaceSelect(place));

      console.log('Marker added at position:', position);
      return marker;
    });

    setMarkers(newMarkers);

    // 검색 결과의 첫 번째 위치로 지도 중심 이동
    if (places.length > 0) {
      const firstPlace = places[0];
      map.setCenter(new window.naver.maps.LatLng(firstPlace.latitude, firstPlace.longitude));
      console.log('Map center set to:', firstPlace.latitude, firstPlace.longitude);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    if (map) {
      const position = new window.naver.maps.LatLng(place.latitude, place.longitude);
      map.setCenter(position);
    }
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
            <div
              key={index}
              className="cursor-pointer border-b p-4 hover:bg-gray-100"
              onClick={() => handlePlaceSelect(place)}
            >
              <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
              <p>{place.roadAddress}</p>
            </div>
          );
        })}
      </div>

      {selectedPlace && (
        <div className="bg-gray-200 p-4">
          <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
          <p>{selectedPlace.roadAddress}</p>
          <button onClick={() => onSave(selectedPlace)} className="mt-2 rounded bg-green-500 p-2 text-white">
            이 장소 저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAddress;
