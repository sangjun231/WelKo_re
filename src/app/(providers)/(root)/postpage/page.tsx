'use client';
import { Place } from '@/types/types';
import { useState } from 'react';
import AddressSearch from './_components/AddressSearch';
import Calendar from './_components/Calendar';
import DayPlaces from './_components/DayPlaces';
import Write from './_components/Write';

function PostPage() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]); // 선택한 장소 목록

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <Calendar next={nextStep} />}
      {step === 2 && (
        <DayPlaces
          next={nextStep}
          prev={prevStep}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedPlaces={selectedPlaces}
        />
      )}
      {step === 3 && (
        <AddressSearch
          prev={prevStep}
          selectedDay={selectedDay}
          selectedPlaces={selectedPlaces}
          setSelectedPlaces={setSelectedPlaces}
        />
      )}
      {step === 4 && <Write prev={prevStep} />}
    </div>
  );
}
export default PostPage;
