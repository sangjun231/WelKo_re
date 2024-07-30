'use client';
import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import MapSelect from './MapSelect';

type MapProps = {
  next: () => void;
  prev: () => void;
};

const NaverMap: React.FC<MapProps> = ({ next, prev }) => {
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const position = useCurrentPosition();
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
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
              const address = response.result.items[0].addrdetail.sigugun;
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

    const initializeMap = () => {
      if (position && window.naver) {
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

    if (isScriptLoaded && position) {
      initializeMap();
    }
  }, [isScriptLoaded, position]);

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
      <div className="flex justify-between">{region && <p>현재 위치: {region}</p>}</div>

      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <MapSelect next={next} />
      <button className="my-4 w-full rounded bg-black p-2 text-white">저장하기</button>
    </>
  );
};

export default NaverMap;
