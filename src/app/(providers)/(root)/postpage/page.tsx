'use client';
import { useState } from 'react';
import Calendar from './_components/Calendar';
import NaverMap from './_components/NaverMap';
import Write from './_components/Write';

export interface CalendarProps {
  next: () => void;
}

function PostPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  //const prevStep = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <Calendar next={nextStep} />}
      {step === 2 && <NaverMap next={nextStep} />}
      {step === 3 && <Write />}
    </div>
  );
}
export default PostPage;
