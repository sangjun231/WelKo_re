'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const RegionForm = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  const loadNaverMapScript = () => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        setIsScriptLoaded(true);
      } else {
        toast.error('네이버 맵 스크립트 로드 실패');
      }
    };

    script.onerror = () => {
      toast.error('네이버 맵 스크립트 로드 실패');
    };

    document.body.appendChild(script);
  };

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

  const getLocationName = (latitude: number, longitude: number) => {
    if (!window.naver) return;

    const coord = new window.naver.maps.LatLng(latitude, longitude);

    window.naver.maps.Service.reverseGeocode(
      {
        location: coord,
        coordType: window.naver.maps.Service.CoordType.LatLng
      },
      (status: any, response: any) => {
        console.log('Reverse Geocode Response:', response);
        if (status === 200) {
          if (response.result.items && response.result.items.length > 0) {
            const address = response.result.items[0].address;
            setLocationName(address);
          } else {
            toast.error('주소를 찾을 수 없습니다.');
          }
        } else {
          toast.error('Failed to get the location name.');
        }
      }
    );
  };

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

      getLocationName(position.latitude, position.longitude);
    }
  };

  useEffect(() => {
    loadNaverMapScript();
  }, []);

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
      <div className="mt-4" id="map" style={{ width: '100%', height: '400px' }}></div>
      {locationName && <p>현재 위치: {locationName}</p>}
      <button className="my-4 rounded bg-black p-2 text-white">저장하기</button>
    </>
  );
};

export default RegionForm;
