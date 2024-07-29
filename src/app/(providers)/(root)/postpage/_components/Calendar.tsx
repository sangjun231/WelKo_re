'use client';
import { upsertDate } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import { addMonths, format, startOfDay } from 'date-fns';
import { useState } from 'react';
import DaySelect from './DaySelect';

const Calendar = ({ next }: { next: () => void }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthLabels = months.map((month) => format(addMonths(new Date(), month), 'MMM yyyy'));

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
        endDate: formatDateForDB(endDate)
      };
      const dateResponse = await upsertDate(datePostData);
      const postId = dateResponse.data.id;
      sessionStorage.setItem('postId', postId);
      next();
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="my-4 overflow-x-auto sm:max-w-[246px]">
        <div className="flex flex-nowrap">
          {months.map((month, index) => (
            <button
              key={index}
              className="mr-2 flex h-16 w-16 items-center justify-center rounded border-2 text-black hover:bg-gray-100"
              onClick={() => setSelectedMonth(addMonths(new Date(), month))}
            >
              {monthLabels[index]}
            </button>
          ))}
        </div>
      </div>
      <DaySelect
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <button className="my-4 rounded bg-black p-2 text-white" onClick={handleDateSave}>
        {startDate && endDate
          ? `${format(startOfDay(startDate), 'yyyy. M. d')} - ${format(startOfDay(endDate), 'M. d')} 선택하기`
          : selectedMonth
            ? `${format(selectedMonth, 'yyyy년 MMM')} 선택하기`
            : '날짜 선택하기'}
      </button>
    </div>
  );
};

export default Calendar;
