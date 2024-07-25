'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import MapSelect from './MapSelect';

type MapProps = {
  next: () => void;
  prev: () => void;
};

const NaverMap: React.FC<MapProps> = ({ next, prev }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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

  useEffect(() => {
    if (isScriptLoaded) {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(37.5112, 127.0981), // 잠실 롯데월드를 중심으로 하는 지도
        zoom: 15
      });

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.5112, 127.0981),
        map: map
      });
    }
  }, [isScriptLoaded]);

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
      <MapSelect />
      <button onClick={next} className="my-4 w-full rounded bg-black p-2 text-white">
        저장하기
      </button>
    </>
  );
};

export default NaverMap;
