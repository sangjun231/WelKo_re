'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import MapSelect from './MapSelect';

type MapProps = {
  next: () => void;
  prev: () => void;
};

const NaverMap: React.FC<MapProps> = ({ next, prev }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${
      process.env.NEXT_PUBLIC_NCP_CLIENT_ID
    }&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      if (window.naver) {
        setIsScriptLoaded(true);
      } else {
        console.error('네이버 맵 스크립트 로드 실패: window.naver가 정의되지 않음');
      }
    };
    script.onerror = () => {
      console.error('네이버 맵 스크립트 로드 실패');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ latitude, longitude });
        },
        (error) => {
          toast.error(`Error occurred while retrieving location: ${error.message}`);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const getRegionName = (latitude: number, longitude: number) => {
    if (!window.naver) return;

    const coord = new window.naver.maps.LatLng(latitude, longitude);

    window.naver.maps.Service.reverseGeocode(
      {
        location: coord,
        coordType: window.naver.maps.Service.CoordType.LatLng
      },
      (status: any, response: any) => {
        if (status === 200) {
          if (response.result.items && response.result.items.length > 0) {
            const address = response.result.items[0].address;
            setRegion(address);
          } else {
            toast.error('주소를 찾을 수 없습니다.');
          }
        } else {
          toast.error('Failed to get the location name.');
        }
      }
    );
  };
  // 현재 위치 띄우기
  const initializeMap = () => {
    if (position) {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(position.latitude, position.longitude),
        zoom: 15
      });

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(position.latitude, position.longitude),
        map: map
      });

      getRegionName(position.latitude, position.longitude);
    }
  };

  useEffect(() => {
    if (isScriptLoaded) {
      getCurrentPosition();
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    if (position) {
      initializeMap();
    }
  }, [position]);

  return (
    <>
      <div className="flex">
        <button onClick={prev}>
          <FaArrowLeft className="m-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold">장소 추가</h1>
          <p>날짜가져오기</p>
        </div>
      </div>
      {/* 수정 필요 */}
      <div className="flex justify-between">
        <p>현재 위치</p>
        <Link href="/" className="underline">
          지역 변경하기
        </Link>
      </div>

      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <MapSelect next={next} />
      <button className="my-4 w-full rounded bg-black p-2 text-white">저장하기</button>
    </>
  );
};

export default NaverMap;
