'use client';
import { useState } from 'react';
import AddressSearch from './_components/AddressSearch';
import Calendar from './_components/Calendar';
import DayPlaces from './_components/DayPlaces';
import Write from './_components/Write';

function PostPage() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string>('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goToStep4 = () => setStep(4);
  const goToStep2 = () => setStep(2);

  return (
    <div>
      {step === 1 && <Calendar next={nextStep} />}
      {step === 2 && (
        <DayPlaces
          next={nextStep}
          prev={prevStep}
          goToStep4={goToStep4}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      )}
      {step === 3 && <AddressSearch prev={prevStep} selectedDay={selectedDay} />}
      {step === 4 && <Write goToStep2={goToStep2} />}
    </div>
  );
}
export default PostPage;
