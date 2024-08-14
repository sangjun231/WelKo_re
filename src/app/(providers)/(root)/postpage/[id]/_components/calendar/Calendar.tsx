'use client';
import BackButton from '@/components/common/Button/BackButton';
import { createClient } from '@/utils/supabase/client';
import { addMonths, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { PiCalendarDots } from 'react-icons/pi';
import DaySelect from '../DaySelect';
import DateSaveButton from './DateSaveButton';

interface CalendarProps {
  next: () => void;
  postId?: string; // 수정 모드일 때 사용
}

const Calendar = ({ next, postId }: CalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthLabelM = months.map((month) => format(addMonths(new Date(), month), 'MMM'));
  const monthLabelY = months.map((month) => format(addMonths(new Date(), month), 'yyyy'));

  // 수정할 때
  useEffect(() => {
    if (postId) {
      const fetchData = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.from('posts').select('startDate, endDate').eq('id', postId).single();

        if (error) {
          console.error('Error fetching post data:', error);
          return;
        }

        if (data) {
          setStartDate(new Date(data.startDate));
          setEndDate(new Date(data.endDate));
        }
      };

      fetchData();
    }
  }, [postId]);

  const handleDateSave = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return;
    }
    const userId = user?.id as string;

    const formatDateForDB = (date: Date | null) => {
      return date?.toISOString().split('T')[0];
    };

    try {
      // 날짜 저장
      if (startDate && endDate) {
        const start = formatDateForDB(startDate) as string;
        const end = formatDateForDB(endDate) as string;
        sessionStorage.setItem('startDate', start);
        sessionStorage.setItem('endDate', end);
        sessionStorage.setItem('userId', userId);
        next();
      } else {
        alert('Please select a date');
      }
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {/* 헤더 부분 디자인 */}
      <div className="my-5 flex items-center">
        <div className="flex w-20 justify-center">
          <BackButton />
        </div>

        <h1 className="flex w-[199px] justify-center text-xl font-semibold">Make tour</h1>
      </div>

      <div className="flex flex-col gap-7 rounded-xl border-x-0 border-y-2 border-gray-200 px-5 shadow-xl">
        <h2 className="ml-3 mt-7 text-2xl font-bold">When&apos;s your tour?</h2>

        <div className="no-scrollbar flex w-[320px] overflow-x-auto">
          {months.map((month, index) => (
            <button
              key={index}
              className="mx-1 flex h-[78px] w-[96px] flex-col items-center justify-center rounded-lg border-2 px-[25px] text-black hover:bg-gray-100"
              onClick={() => setSelectedMonth(addMonths(new Date(), month))}
            >
              <PiCalendarDots className="mb-1 size-5 text-grayscale-500" />
              <p className="flex">
                <span className="mr-1 text-sm font-semibold">{monthLabelM[index]}</span>
                <span className="text-sm">{monthLabelY[index]}</span>
              </p>
            </button>
          ))}
        </div>

        <DaySelect
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <DateSaveButton onClick={handleDateSave} />
      </div>
    </div>
  );
};

export default Calendar;
