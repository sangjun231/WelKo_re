'use client';

import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { Place } from '@/types/types';
import { savePlaces, translateAddress } from '@/utils/post/postData';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

type PlaceProps = {
  next: () => void;
  prev: () => void;
  goToStep4: () => void;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
};

const DayPlaces: React.FC<PlaceProps> = ({ next, prev, goToStep4, selectedDay, setSelectedDay }) => {
  const [region, setRegion] = useState<string | null>(null);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]); // 선택한 장소 목록
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };
  //지도 관련
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const position = useCurrentPosition();
  const [markers, setMarkers] = useState<any[]>([]);
  //sessionStorage 관련
  const storedPlaces = sessionStorage.getItem(selectedDay); //선택한 day에 맞는 value값 가져옴
  const keys = Object.keys(sessionStorage);
  const storedPlacesKey = keys.find((key) => sessionStorage.getItem(key) === storedPlaces);
  useEffect(() => {
    if (storedPlaces) {
      if (storedPlacesKey === selectedDay) {
        setSelectedPlaces(JSON.parse(storedPlaces));
      }
    }
  }, [selectedDay]);

  // 지도 띄우기
  useEffect(() => {
    // 현재 위치 이름 가져오기
    const getRegionName = (latitude: number, longitude: number) => {
      if (!window.naver) return;
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
    if (!isScriptLoaded || !position) return;
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
        //center 이동하기
        const newCenter = new window.naver.maps.LatLng(selectedPlaces[0].latitude, selectedPlaces[0].longitude);
        mapInstance.setCenter(newCenter);
        selectedPlaces.forEach((place, index) => {
          // 마커 꾸미기
          const markerContent = `
          <div class="text-white bg-primary-300 border-2 border-white px-2 rounded-full">${index + 1}</div>
      `;
          //저장된 장소 마커 생성하기
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
    };
    initializeMap();
  }, [isScriptLoaded, position, selectedPlaces]);

  //장소 저장 핸들러
  const addMutation = useMutation({
    mutationFn: savePlaces
  });

  const handlePlaceSave = async () => {
    const postId = sessionStorage.getItem('postId');
    if (!postId) {
      console.error('Post ID not found');
      return;
    }
    addMutation.mutate(
      {
        post_id: postId,
        day: selectedDay,
        places: selectedPlaces.map((place) => place.title),
        lat: selectedPlaces.map((place) => place.latitude),
        long: selectedPlaces.map((place) => place.longitude),
        area: region
      },
      {
        onSuccess: () => {
          alert('Saved successfully!');
        },
        onError: (error) => {
          console.error('Error saving places:', error);
          alert('Failed to save.');
        }
      }
    );
  };

  return (
    <>
      <div className="flex">
        <button onClick={prev}>
          <FaArrowLeft className="m-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold">장소 추가</h1>
          <p>날짜별 일정 추가</p>
        </div>
      </div>
      <div className="flex justify-between">{region && <p>현재 위치: {region}</p>}</div>

      <div id="map" style={{ width: '100%', height: '300px' }}></div>
      <div>
        <div className="flex">
          <div>
            <button
              className="rounded-full bg-grayscale-50 p-3 hover:bg-primary-300 hover:text-white active:bg-primary-300 active:text-white"
              onClick={() => handleDaySelect('day1')}
            >
              Day 1
            </button>
          </div>

          <button
            className="rounded-full bg-grayscale-50 p-3 hover:bg-primary-300 hover:text-white active:bg-primary-300 active:text-white"
            onClick={() => handleDaySelect('day2')}
          >
            Day 2
          </button>
          <button
            className="rounded-full bg-grayscale-50 p-3 hover:bg-primary-300 hover:text-white active:bg-primary-300 active:text-white"
            onClick={() => handleDaySelect('day3')}
          >
            Day 3
          </button>
        </div>

        <hr className="m-3" />
        {selectedDay === '' ? (
          <button className="border-gray cursor-default rounded-full border-2 p-2">Please select a day</button>
        ) : (
          <button className="border-gray rounded-full border-2 p-2" onClick={next}>
            {selectedDay === 'day1' && 'Day1 Add Address'}
            {selectedDay === 'day2' && 'Day2 Add Address'}
            {selectedDay === 'day3' && 'Day3 Add Address'}
          </button>
        )}
        <div>
          {selectedDay === storedPlacesKey &&
            selectedPlaces.map((place, index) => {
              const cleanHTML = DOMPurify.sanitize(place.title);
              return (
                <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
                  <div>
                    <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                    <p>{place.roadAddress}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {selectedDay === '' ? (
        ''
      ) : (
        <>
          <button onClick={handlePlaceSave} className="my-4 w-full rounded bg-black p-2 text-white">
            {selectedDay === 'day1' && 'Day1 Save'}
            {selectedDay === 'day2' && 'Day2 Save'}
            {selectedDay === 'day3' && 'Day3 Save'}
          </button>
          <button onClick={goToStep4} className="my-4 w-full rounded bg-black p-2 text-white">
            write page
          </button>
        </>
      )}
    </>
  );
};

export default DayPlaces;
