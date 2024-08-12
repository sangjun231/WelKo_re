'use client';
import useAuthStore from '@/zustand/bearsStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddressSearch from './_components/AddressSearch';
import Calendar from './_components/calendar/Calendar';
import DayPlaces from './_components/dayplaces/DayPlaces';
import Write from './_components/Write';

function PostPage() {
  const { id } = useParams();
  const postId = id;
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [sequence, setSequence] = useState<number>(0);

  useEffect(() => {
    sessionStorage.setItem('postId', postId as string);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id as string)) {
      alert('Please enter through the correct path');
      router.back(); // 유효하지 않은 경우 이전 페이지로 이동
      return;
    }
    if (!user) {
      alert('Please log in');
      router.push('/login');
      return;
    }
  }, [user, id, router]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goToStep4 = () => setStep(4);
  const goToStep2 = () => setStep(2);

  return (
    <div>
      {step === 1 && <Calendar next={nextStep} postId={postId as string} />}
      {step === 2 && (
        <DayPlaces
          next={nextStep}
          prev={prevStep}
          goToStep4={goToStep4}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          region={region}
          setRegion={setRegion}
          sequence={sequence}
          setSequence={setSequence}
        />
      )}
      {step === 3 && <AddressSearch prev={prevStep} selectedDay={selectedDay} sequence={sequence} />}
      {step === 4 && <Write goToStep2={goToStep2} region={region} />}
    </div>
  );
}
export default PostPage;
