'use client';
import { useEffect, useState } from 'react';
import { CalendarProps } from '../page';
import MapSelect from './MapSelect';

const NaverMap: React.FC<CalendarProps> = ({ next }) => {
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
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <MapSelect />
      <button onClick={next} className="my-4 rounded bg-black p-2 text-white">
        저장하기
      </button>
    </>
  );
};

export default NaverMap;
