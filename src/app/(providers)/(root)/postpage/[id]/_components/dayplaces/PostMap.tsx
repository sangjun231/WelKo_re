import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { Place } from '@/types/types';
import { translateAddress } from '@/utils/post/postData';
import React, { useEffect, useState } from 'react';

const PostMap = ({
  selectedPlaces,
  setRegion
}: {
  selectedPlaces: Place[];
  setRegion: React.Dispatch<React.SetStateAction<string>>;
}) => {
  //지도 관련
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const position = useCurrentPosition();
  const [markers, setMarkers] = useState<any[]>([]);
  // 지도 띄우기
  useEffect(() => {
    if (!isScriptLoaded || !position) return;
    // 현재 위치 이름 가져오기
    const getRegionName = (latitude: number, longitude: number) => {
      if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
        console.error('네이버 맵 서비스가 초기화되지 않았습니다.');
        return;
      }
      const coord = new window.naver.maps.LatLng(latitude, longitude);
      window.naver.maps.Service.reverseGeocode(
        {
          location: coord,
          coordType: window.naver.maps.Service.CoordType.LatLng
        },
        //현재 위치 이름 영어로 번역하기
        async (status: any, response: any) => {
          if (status === 200) {
            if (response.result.items && response.result.items.length > 0) {
              const address = response.result.items[0].addrdetail.sigugun;
              try {
                const translatedAddress = await translateAddress(address);
                setRegion(translatedAddress.split(' ')[0]);
              } catch (error) {
                console.error('Failed to translate address:', error);
                alert('Failed to translate address.');
              }
            } else {
              alert('Failed to get the location name.');
            }
          }
        }
      );
    };
    // 현재 위치로 지도 띄우기
    const initializeMap = () => {
      const mapInstance = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(position.latitude, position.longitude),
        zoom: 14
      });
      const currentMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(position.latitude, position.longitude),
        map: mapInstance
      });

      getRegionName(position.latitude, position.longitude);
      setMarkers([currentMarker]);

      // 추가한 장소로 지도 띄우기
      if (selectedPlaces.length > 0) {
        //기존 마커 숨기기
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);

        // 유효한 장소만 필터링하고 원래 인덱스를 기억하기
        const validPlaces = selectedPlaces
          .map((place, index) => (place ? { place, index } : null))
          .filter((item) => item !== null);

        if (validPlaces.length > 0) {
          // 첫 번째 유효한 장소로 중심 이동
          const newCenter = new window.naver.maps.LatLng(validPlaces[0].place.latitude, validPlaces[0].place.longitude);
          mapInstance.setCenter(newCenter);

          validPlaces.forEach(({ place, index }) => {
            // 마커 꾸미기
            const markerContent = `
      <div class="text-white bg-primary-300 border-2 border-white size-6 rounded-full text-center text-sm">${index + 1}</div>
      `;
            // 저장된 장소 마커 생성하기
            new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(place.latitude, place.longitude),
              map: mapInstance,
              title: place.title,
              icon: {
                content: markerContent,
                anchor: new window.naver.maps.Point(12, 12)
              }
            });
          });
        }
      }
    };
    initializeMap();
  }, [isScriptLoaded, position, selectedPlaces]);
  return <div id="map" style={{ width: '100%', height: '300px' }}></div>;
};

export default PostMap;
