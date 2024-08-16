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

      const parsedPlaces = data.places.map((item: any) => {
        return {
          lat: item.lat,
          long: item.long,
          places: item.places
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
    };

    initializeMap();
  }, [isScriptLoaded, isLoading, data]);

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
      <h2 className="web:text-4xl web:mb-6 mb-4 font-semibold text-grayscale-900">Where you’ll tour</h2>
      <div
        id="map"
        style={{
          width: '100%',
          height: isWeb ? '620px' : '300px'
        }}
      ></div>

      <div className="web:my-20 web:gap-5 web:text-xl my-6 flex gap-2 text-xs font-medium">
        {data.places.length > 0 && (
          <button
            onClick={() => setSelectedDay(0)}
            className={`web:px-5 web:py-3 rounded-3xl px-4 py-2 ${selectedDay === 0 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 1
          </button>
        )}
        {data.places.length > 1 && (
          <button
            onClick={() => setSelectedDay(1)}
            className={`web:px-5 web:py-3 rounded-3xl px-4 py-2 ${selectedDay === 1 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 2
          </button>
        )}
        {data.places.length > 2 && (
          <button
            onClick={() => setSelectedDay(2)}
            className={`web:px-5 web:py-3 rounded-3xl px-4 py-2 ${selectedDay === 2 ? 'bg-primary-300 text-white' : 'bg-grayscale-50'}`}
          >
            Day 3
          </button>
        )}
      </div>

      <div className={`web:flex web:flex-row web:justify-between flex flex-col gap-4`}>
        {[0, 3].map((startIdx) => (
          <div key={startIdx} className="web:w-1/2 flex flex-col gap-4">
            {data?.places[selectedDay].places.slice(startIdx, startIdx + 3).map((place, index) => (
              <div key={index} className="relative flex items-start">
                <div className="flex flex-col items-center">
                  <div className="web:h-11 web:w-11 web:text-2xl z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary-300 text-sm font-medium text-white">
                    {startIdx + index + 1}
                  </div>
                  {index !== 2 && <div className="absolute top-6 h-full w-px bg-grayscale-100"></div>}
                </div>
                <div className="web:p-6 web:ml-12 web:mb-10 ml-3 flex w-full flex-col gap-1 rounded-lg bg-white px-4 py-3 shadow-custom-box">
                  <h2 className="web:text-xl text-sm font-semibold">
                    {place.title ? place.title.replace(/<\/?[^>]+(>|$)/g, '') : ''}
                  </h2>
                  <p className="web:text-base text-xs text-gray-500">{place.category}</p>
                  <hr className="web:my-4 my-2 h-[1px] w-full bg-grayscale-100" />
                  <p className="web:text-lg text-xs font-normal text-gray-700">{place.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <hr className="web:my-20 mb-6 mt-8 h-[1px] w-full bg-grayscale-100" />
    </div>
  );
};

export default ScheduleMap;
