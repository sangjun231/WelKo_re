'use client';

import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { Place } from '@/types/types';
import { savePlaces, translateAddress } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { GrLocation } from 'react-icons/gr';
import { IoChevronBack } from 'react-icons/io5';

type PlaceProps = {
  next: () => void;
  prev: () => void;
  goToStep4: () => void;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  region: string;
  setRegion: React.Dispatch<React.SetStateAction<string>>;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
};

const DayPlaces: React.FC<PlaceProps> = ({
  next,
  prev,
  goToStep4,
  selectedDay,
  setSelectedDay,
  region,
  setRegion,
  date,
  setDate
}) => {
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
    if (sessionStorage.getItem('date')) {
      setDate(sessionStorage.getItem('date')!);
    }
    if (storedPlaces) {
      if (storedPlacesKey === selectedDay) {
        setSelectedPlaces(JSON.parse(storedPlaces));
      }
    }
  }, [selectedDay]);

  const postId = sessionStorage.getItem('postId');

  // 수정할 때, Supabase에서 장소 데이터를 불러오기
  useEffect(() => {
    if (postId && selectedDay) {
      const fetchPlaces = async () => {
        const supabase = createClient();
        const { data: placesData, error } = await supabase
          .from('schedule')
          .select('*')
          .eq('post_id', postId)
          .eq('day', selectedDay);

        if (placesData && placesData.length > 0) {
          // 첫 번째 결과만 사용 (하나의 day에 대한 데이터만 있을 것으로 가정)
          const placeData = placesData[0];
          // 사용하기 쉬운 형태로 변환
          // const combinedPlaces = placeData.map((place: any, index: number) => ({
          //   places:
          //   lat: placeData.lat[index],
          //   long: placeData.long[index]
          // }));

          //setSelectedPlaces(combinedPlaces);
        } else {
          console.log('No data found for the given postId and day');
        }
      };
      fetchPlaces();
    }
  }, [selectedDay, postId]);

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

  //장소마다 소개 작성
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>(
    selectedPlaces.reduce((acc, _, index) => ({ ...acc, [index]: '' }), {})
  );

  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [index]: value
    }));
  };

  //장소 저장 핸들러
  const addMutation = useMutation({
    mutationFn: savePlaces
  });
  const handlePlaceSave = async () => {
    if (!postId) {
      console.error('Post ID not found');
      return;
    }
    addMutation.mutate(
      {
        post_id: postId,
        day: selectedDay,
        places: selectedPlaces.map((place, index) => ({
          title: place.title,
          category: place.category,
          roadAddress: place.roadAddress,
          description: descriptions[index]
        })),
        lat: selectedPlaces.map((place) => place.latitude),
        long: selectedPlaces.map((place) => place.longitude),
        area: region
      },
      {
        onSuccess: () => {
          setDescriptions({});
          alert('Saved!');
        },
        onError: (error) => {
          console.error('Error saving places:', error);
          alert('Failed to save.');
        }
      }
    );
  };

  return (
    <div className="m-3 flex flex-col justify-center">
      <div className="my-7 flex items-center">
        <div className="icon-button">
          <button onClick={prev} className="flex h-full w-full items-center justify-center">
            <IoChevronBack size={24} />
          </button>
        </div>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold">{region}</h1>
          <p>{date}</p>
        </div>
      </div>

      <div className="flex items-center">
        <GrLocation className="size-5" /> <p className="ml-2 font-semibold">{region}</p>
      </div>

      <div id="map" style={{ width: '100%', height: '300px' }}></div>

      <div>
        <div className="mt-3 flex gap-2">
          {['day1', 'day2', 'day3'].map((day, index) => (
            <button
              key={day}
              className="rounded-full bg-grayscale-50 px-4 py-3 font-medium hover:bg-primary-300 hover:text-white active:bg-primary-300 active:text-white"
              onClick={() => handleDaySelect(day)}
            >
              {`Day ${index + 1}`}
            </button>
          ))}
        </div>

        {selectedDay === '' ? (
          <p className="p-2 text-center">Please select a day</p>
        ) : (
          [1, 2, 3, 4].map((number, index) => (
            <div key={index} className="mb-2 flex items-center">
              <p className="size-6 rounded-full border-2 border-grayscale-50 bg-primary-300 text-center text-white">
                {number}
              </p>
              <button
                className="h-[35px] w-[284px] rounded-lg border-2 border-grayscale-100 p-2 font-medium"
                onClick={next}
              >
                Add Place
              </button>
            </div>
          ))
        )}
        {/* {selectedDay === 'day1' && 'Day1 Add Address'}
            {selectedDay === 'day2' && 'Day2 Add Address'}
            {selectedDay === 'day3' && 'Day3 Add Address'}*/}
        <div>
          {selectedDay === storedPlacesKey &&
            selectedPlaces.map((place, index) => {
              const cleanHTML = DOMPurify.sanitize(place.title);
              return (
                <div key={index} className="flex justify-between border-b p-4 hover:bg-gray-100">
                  <div>
                    <h3 className="font bold" dangerouslySetInnerHTML={{ __html: cleanHTML }} />
                    <div className="flex text-xs text-gray-400">
                      <p>{place.category} •&nbsp;</p>
                      <p className="text-xs text-gray-400">{place.roadAddress}</p>
                    </div>

                    <hr className="mb-2 border" />

                    <textarea
                      className="resize-none"
                      placeholder="간단한 소개 작성"
                      value={descriptions[index] || ''}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    />
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
          <button
            onClick={handlePlaceSave}
            className="mx-auto my-5 h-14 w-[320px] rounded-2xl bg-primary-300 p-2 text-lg font-semibold text-white"
          >
            {selectedDay === 'day1' && 'Day1 Save'}
            {selectedDay === 'day2' && 'Day2 Save'}
            {selectedDay === 'day3' && 'Day3 Save'}
          </button>
          <button onClick={goToStep4}>없앨 버튼</button>
        </>
      )}
    </div>
  );
};

export default DayPlaces;
