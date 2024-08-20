'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNaverMapScript } from '@/hooks/Map/useNaverMapScript';
import { WebProps } from '@/types/webstate';

interface Place {
  title: string;
  category: string;
  description: string;
}

interface PlaceData {
  lat: number[];
  long: number[];
  places: Place[];
  day: string;
}

interface PostAndPlacesData {
  places: PlaceData[];
}

const ScheduleMap = ({ isWeb }: WebProps) => {
  const clientId = process.env.NEXT_PUBLIC_NCP_CLIENT_ID!;
  const isScriptLoaded = useNaverMapScript(clientId);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedDay, setSelectedDay] = useState(0);

  const fetchPostAndPlaces = async (postId: string): Promise<PostAndPlacesData> => {
    try {
      const response = await axios.get(`/api/detail/map/${postId}`);
      const data = response.data;

      const parsedPlaces = data.places.map((item: any, index: number) => {
        return {
          lat: item.lat,
          long: item.long,
          places: item.places,
          day: item.day || `Day ${index + 1}`
        };
      });

      return { places: parsedPlaces };
    } catch (error) {
      console.error('Error fetching post and places:', error);
      throw error;
    }
  };

  const { data, error, isLoading } = useQuery<PostAndPlacesData>({
    queryKey: ['postAndPlaces', postId],
    queryFn: () => fetchPostAndPlaces(postId)
  });

  useEffect(() => {
    if (!isScriptLoaded || isLoading || !data || data.places.length === 0) return;

    const initializeMap = () => {
      const map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(data.places[0].lat[0], data.places[0].long[0]),
        zoom: 10
      });
      setMapInstance(map);

      // 맵 클릭 이벤트 추가
      window.naver.maps.Event.addListener(map, 'click', () => {
        map.setCenter(new window.naver.maps.LatLng(data.places[selectedDay].lat[0], data.places[selectedDay].long[0]));
        map.setZoom(12); // 원하는 줌 레벨로 설정
      });
    };

    initializeMap();
  }, [isScriptLoaded, isLoading, data, selectedDay]);

  useEffect(() => {
    if (!mapInstance || !data) return;

    if (mapInstance.markers) {
      mapInstance.markers.forEach((marker: any) => marker.setMap(null));
    } else {
      mapInstance.markers = [];
    }

    const newMarkers = data.places[selectedDay].lat
      .map((lat: number, index: number) => {
        if (index < data.places[selectedDay].long.length) {
          const markerContent = `
          <div class="w-6 h-6 web:w-11 web:h-11 text-white bg-primary-300 flex items-center p-2 justify-center border-2 border-white rounded-full">
          ${index + 1}
        </div>
        `;
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(lat, data.places[selectedDay].long[index]),
            map: mapInstance,
            title: data.places[selectedDay].places[index].title,
            icon: {
              content: markerContent,
              anchor: new window.naver.maps.Point(12, 12)
            }
          });
          return marker;
        }
      })
      .filter((marker) => marker !== undefined);

    mapInstance.markers = newMarkers;
  }, [mapInstance, data, selectedDay]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading map data</div>;

  if (!data) return <div>No data available</div>;

  return (
    <div className="flex flex-col text-lg">
      <h2 className="mb-4 font-semibold text-grayscale-900 web:mb-6 web:text-4xl">Where you’ll tour</h2>
      <div
        id="map"
        style={{
          width: '100%',
          height: isWeb ? '620px' : '300px'
        }}
      ></div>

      <div className="my-6 flex gap-2 text-xs font-medium web:my-20 web:gap-5 web:text-xl">
        {data.places.map((place, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`rounded-3xl px-4 py-2 web:px-5 web:py-3 ${
              selectedDay === index ? 'bg-primary-300 text-white' : 'bg-grayscale-50'
            }`}
          >
            {place.day}
          </button>
        ))}
      </div>

      <div className={`flex flex-col gap-4 web:flex web:gap-x-20`}>
        <div className="flex flex-col gap-4">
          {data?.places[selectedDay].places.map((place, index) => (
            <div key={index} className="relative flex items-start">
              <div className="flex flex-col items-center">
                <div className="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-300 text-sm font-medium text-white web:h-11 web:w-11 web:text-2xl">
                  {index + 1}
                </div>
                {/* 마지막 요소가 아닌 경우에만 <hr> 렌더링 */}
                {index < data?.places[selectedDay].places.length - 1 && (
                  <div className="absolute top-6 mb-8 h-full w-px bg-grayscale-100"></div>
                )}
              </div>
              <div className="ml-3 flex w-full flex-col gap-1 rounded-lg bg-white px-4 py-3 shadow-custom-box web:mb-10 web:ml-12 web:p-6">
                <h2 className="text-sm font-semibold web:text-xl">
                  {place.title ? place.title.replace(/<\/?[^>]+(>|$)/g, '') : ''}
                </h2>
                <p className="text-xs text-gray-500 web:text-base">{place.category}</p>
                <hr className="my-2 h-[1px] w-full bg-grayscale-100 web:my-4" />
                <p className="text-xs font-normal text-gray-700 web:text-lg">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="mb-6 mt-8 h-[1px] w-full bg-grayscale-100 web:my-20" />
    </div>
  );
};

export default ScheduleMap;
