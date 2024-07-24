'use client';
import { useState } from 'react';
import Calendar from './_components/Calendar';
import Step2 from './_components/Step2';

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
      {step === 2 && <Step2 />}
    </div>
  );
}
export default PostPage;
