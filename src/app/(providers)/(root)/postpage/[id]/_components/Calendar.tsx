'use client';
import BackButton from '@/components/common/Button/BackButton';
import { upsertDate } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import { addMonths, format, startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { PiCalendarDots } from 'react-icons/pi';
import DaySelect from './DaySelect';

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
    const user_id = user?.id as string;

    const formatDateForDB = (date: Date | null) => {
      return date?.toISOString().split('T')[0];
    };

    try {
      // 날짜 저장
      const datePostData = {
        user_id,
        startDate: formatDateForDB(startDate),
        endDate: formatDateForDB(endDate),
        id: postId // postId를 포함하여 기존 데이터를 업데이트
      };
      const dateResponse = await upsertDate(datePostData);
      const post_id = dateResponse.data.id;
      sessionStorage.setItem('postId', post_id);
      //sessionStorage.setItem('datePostData', JSON.stringify(datePostData));
      next();
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  return (
    <div className="m-3 flex flex-col justify-center">
      <div className="my-7 flex items-center">
        <BackButton />
        <h1 className="m-auto text-2xl font-semibold">Make tour</h1>
      </div>

      <div className="flex flex-col gap-7 rounded-xl border-x-0 border-y-2 border-gray-200 shadow-xl">
        <h2 className="ml-3 mt-7 text-2xl font-bold">When's your tour?</h2>

        <div className="flex w-[360px] overflow-x-auto">
          {months.map((month, index) => (
            <button
              key={index}
              className="mx-1 flex h-20 w-[96px] flex-col items-center justify-center rounded-lg border-2 px-12 text-black hover:bg-gray-100"
              onClick={() => setSelectedMonth(addMonths(new Date(), month))}
            >
              <PiCalendarDots className="mb-1 size-5 text-grayscale-500" />
              <p className="flex">
                <p className="mr-1 text-sm font-semibold">{monthLabelM[index]}</p>
                <p className="text-sm">{monthLabelY[index]}</p>
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

        <button
          className="mx-auto h-14 w-[288px] rounded-2xl bg-primary-300 p-2 text-lg text-white"
          onClick={handleDateSave}
        >
          {startDate && endDate
            ? `${format(startOfDay(startDate), 'yy. M. d')} - ${format(startOfDay(endDate), 'M. d')} Select`
            : selectedMonth
              ? `${format(selectedMonth, 'yyyy MMM')} Select`
              : 'Select'}
        </button>
        <button onClick={next}>없앨 버튼</button>
      </div>
    </div>
  );
};

export default Calendar;
