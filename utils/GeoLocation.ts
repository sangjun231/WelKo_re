import { useEffect, useState } from 'react';

// 타입 정의
interface GeoLocation {
  latitude: number;
  longitude: number;
}

function useGeoLocation() {
  // 초기 상태는 null로 설정
  const [myLocation, setMyLocation] = useState<GeoLocation | null>(null);

  useEffect(() => {
    // Geolocation API 사용
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  // 성공 콜백
  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setMyLocation({ latitude, longitude });
  };

  // 에러 콜백
  const handleError = (error: GeolocationPositionError) => {
    console.error('Geolocation error:', error.message);
  };

  return myLocation;
}

export default useGeoLocation;
