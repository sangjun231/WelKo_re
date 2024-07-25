'use client';
import { eachDayOfInterval, endOfMonth, format, isSameDay, isWithinInterval, startOfMonth } from 'date-fns';
import React from 'react';

interface CalendarProps {
  selectedMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
}

const DaySelect: React.FC<CalendarProps> = ({ selectedMonth, startDate, endDate, setStartDate, setEndDate }) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  const handleDayClick = (day: Date) => {
    console.log(day);
    if (!startDate || (startDate && endDate)) {
      //새로 시작 날짜 설정
      setStartDate(day);
      setEndDate(null);
    } else if (day < startDate) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  return (
    <div className="rounded-lg border p-4 shadow-md">
      <div className="mb-4 text-lg font-bold">{format(selectedMonth, 'yyyy년 MMM')}</div>
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => (
          <button
            key={day.toString()}
            className={`p-2 ${isWithinInterval(day, { start: startDate || new Date(), end: endDate || startDate || new Date() }) ? 'rounded-full bg-gray-300' : 'bg-white'} ${isSameDay(day, new Date()) ? 'rounded-full bg-red-200' : 'border-white'}`}
            onClick={() => handleDayClick(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DaySelect;
