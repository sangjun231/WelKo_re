'use client';

import { useCurrentPosition } from '@/hooks/Map/useCurrentPosition';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { Place } from '@/types/types';
import { formatDateRange } from '@/utils/detail/functions';
import { translateAddress } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  sequence: number;
  setSequence: React.Dispatch<React.SetStateAction<number>>;
};

const DayPlaces: React.FC<PlaceProps> = ({
  next,
  prev,
  goToStep4,
  selectedDay,
  setSelectedDay,
  region,
  setRegion,
  sequence,
  setSequence
}) => {
  const [days, setDays] = useState<string[]>([]);
  const [editDay, setEditDay] = useState('');
  const startDate = sessionStorage.getItem('startDate');
  const endDate = sessionStorage.getItem('endDate');
  const postId = sessionStorage.getItem('postId');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    window.scrollTo(0, 0);

    if (startDate && endDate) {
      const startDateString = new Date(startDate);
      const endDateString = new Date(endDate);
      const dayArray: string[] = [];

      let currentDate = new Date(startDateString);
      let dayCount = 1;

      while (currentDate <= endDateString) {
        dayArray.push(`Day ${dayCount}`);
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      setDays(dayArray);
    }
  }, []);

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
  }, [selectedDay, storedPlaces, storedPlacesKey]);

  // 수정할 때, Supabase에서 장소 데이터를 불러오기
  useEffect(() => {
    if (postId && selectedDay) {
      const fetchPlaces = async () => {
        const supabase = createClient();
        const { data: placesData, error } = await supabase
          .from('schedule')
          .select('places, lat, long, area')
          .eq('post_id', postId)
          .eq('day', selectedDay)
          .single();
        console.log(placesData);
        //if (placesData && placesData.length > 0) {
        // 첫 번째 결과만 사용 (하나의 day에 대한 데이터만 있을 것으로 가정)
        // const placeData = placesData[0];
        // 사용하기 쉬운 형태로 변환
        // const combinedPlaces = placeData.map((place: any, index: number) => ({
        //   places:
        //   lat: placeData.lat[index],
        //   long: placeData.long[index]
        // }));

        //setSelectedPlaces(combinedPlaces);
        // } else {
        //   console.log('No data found for the given postId and day');
        // }
        if (error) {
          console.error('Error fetching data:', error);
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

  // 장소마다 소개 작성
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>({});

  // 컴포넌트가 렌더링될 때 초기 description 값을 설정
  useEffect(() => {
    const initialDescriptions = selectedPlaces.reduce((acc: { [key: number]: string }, place, index) => {
      acc[index] = place.description || '';
      return acc;
    }, {});
    setDescriptions(initialDescriptions);
  }, [selectedPlaces]);

  // description 값을 업데이트하고 sessionStorage에 저장
  const handleDescriptionChange = (index: number, value: string) => {
    setDescriptions((prevDescriptions) => ({
      ...prevDescriptions,
      [index]: value
    }));

    const updatedPlaces = [...selectedPlaces];
    if (updatedPlaces[index]) {
      updatedPlaces[index].description = value;
      sessionStorage.setItem(selectedDay, JSON.stringify(updatedPlaces));
    }
  };

  const handleAddSequence = (index: number) => {
    setSequence(index);
    next();
  };
  const router = useRouter();
  const handleCancel = () => {
    const userConfirmed = confirm('Do you want to cancel this?');
    if (!userConfirmed) {
      return;
    }
    router.replace('/');
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="my-5 flex items-center">
        <div className="flex w-20 justify-center">
          <div className="icon-button">
            <button onClick={prev} className="flex h-full w-full items-center justify-center">
              <IoChevronBack size={24} />
            </button>
          </div>
        </div>

        <div className="flex w-[199px] flex-col items-center">
          <h1 className="text-lg font-bold">{region}</h1>
          <p>{formatDateRange(startDate, endDate)}</p>
        </div>
        <button className="flex w-20 justify-center font-medium text-[#FF7029]" onClick={handleCancel}>
          Done
        </button>
      </div>

      <div className="m-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex">
            <GrLocation className="size-5" />
            <p className="ml-2 font-semibold">{region}</p>
          </div>

          <Link
            href={`/${userId}/profilepage/regionpage`}
            className="cursor-pointer font-semibold text-grayscale-500 underline"
          >
            Change Location
          </Link>
        </div>

        <div id="map" style={{ width: '100%', height: '300px' }}></div>

        <div>
          <div className="mb-4 flex gap-2">
            {days.map((day, index) => (
              <button
                key={index}
                className="rounded-full bg-grayscale-50 px-4 py-2 text-sm font-medium hover:bg-primary-300 hover:text-white active:bg-primary-300 active:text-white"
                onClick={() => handleDaySelect(day)}
              >
                {day}
              </button>
            ))}
          </div>

          {selectedDay === ''
            ? ''
            : [1, 2, 3, 4].map((number, index) => (
                <div key={index} className="flex flex-col">
                  <div className="mb-4 flex">
                    <div className="relative">
                      <p className="relative z-10 mr-2 size-6 rounded-full border-2 border-grayscale-50 bg-primary-300 text-center text-sm text-white">
                        {number}
                      </p>
                      <div className="absolute left-1/3 h-full w-0.5 -translate-x-1/2 bg-grayscale-100"></div>
                    </div>

                    <div className="rounded-2xl shadow-lg">
                      <button
                        className="flex h-[35px] w-[284px] items-center justify-center rounded-lg border-2 border-grayscale-100 p-2 font-medium"
                        onClick={() => handleAddSequence(index)}
                      >
                        Select Place
                      </button>
                      {selectedDay === storedPlacesKey && selectedPlaces[index] && (
                        <div key={index} className="p-4 hover:bg-gray-100">
                          <h3
                            className="font-bold"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPlaces[index].title) }}
                          />
                          <div className="flex flex-wrap text-xs text-gray-400">
                            <p>{selectedPlaces[index].category} •&nbsp;</p>
                            <p className="text-xs text-gray-400">{selectedPlaces[index].roadAddress}</p>
                          </div>

                          <hr className="my-2" />

                          <textarea
                            className="h-full w-full resize-none p-2"
                            placeholder="Introduce your place."
                            value={descriptions[index] || ''}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {selectedDay === '' ? (
          ''
        ) : (
          <>
            <button
              onClick={goToStep4}
              className="mx-auto h-14 w-[320px] rounded-2xl bg-primary-300 p-2 text-lg font-semibold text-white"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DayPlaces;
