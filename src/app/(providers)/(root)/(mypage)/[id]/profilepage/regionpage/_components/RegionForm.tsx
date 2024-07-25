'use client';
import { useEffect, useState } from 'react';

const RegionForm = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ latitude, longitude });
        },
        (error) => {
          console.error('Error occurred while retrieving location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && position) {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(position.latitude, position.longitude),
        zoom: 15
      });

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(position.latitude, position.longitude),
        map: map
      });
    }
  }, [isScriptLoaded, position]);

  return (
    <>
      <div className="mt-4" id="map" style={{ width: '100%', height: '400px' }}></div>

      <button className="my-4 rounded bg-black p-2 text-white">저장하기</button>
    </>
  );
};

export default RegionForm;
