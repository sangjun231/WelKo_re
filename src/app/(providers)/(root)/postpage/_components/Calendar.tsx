'use client';
import { addMonths, format } from 'date-fns';
import React, { useState } from 'react';
import { CalendarProps } from '../page';
import DaySelect from './DaySelect';

const Calendar: React.FC<CalendarProps> = ({ next }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const monthLabels = months.map((month) => format(addMonths(new Date(), month), 'MMM yyyy'));

  const handleDateSave = () => {
    next();
    console.log({ startDate, endDate });
  };
  return (
    <div className="flex flex-col justify-center">
      <div className="my-4 flex flex-wrap justify-center gap-3">
        {months.map((month, index) => (
          <button
            key={index}
            className="w-16 rounded border-2 p-2 text-black hover:bg-gray-100"
            onClick={() => setSelectedMonth(addMonths(new Date(), month))}
          >
            {monthLabels[index]}
          </button>
        ))}
      </div>
      <DaySelect
        selectedMonth={selectedMonth}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <button className="my-4 rounded bg-black p-2 text-white" onClick={handleDateSave}>
        {startDate && endDate
          ? `${format(startDate, 'yyyy. M. d')} - ${format(endDate, 'M. d')} 선택하기`
          : selectedMonth
            ? `${format(selectedMonth, 'yyyy년 MMM')} 선택하기`
            : '날짜 선택하기'}
      </button>
    </div>
  );
};

export default Calendar;
