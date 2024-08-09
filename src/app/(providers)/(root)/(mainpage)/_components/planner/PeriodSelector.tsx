'use client';
import { addMonths, format } from 'date-fns';
import React, { useState } from 'react';
import DaySelect from '../planner/DaySelect';

interface PeriodSelectorProps {
  next: () => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ next, startDate, endDate, setStartDate, setEndDate }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthLabels = months.map((month) => format(addMonths(new Date(), month), 'MMM yyyy'));

  const handleDateSave = () => {
    next();
  };

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (date) {
      if (type === 'start') {
        setStartDate(date); // 선택한 날짜를 그대로 설정
      } else {
        setEndDate(date); // 선택한 날짜를 그대로 설정
      }
    }
  };

  return (
    <div className="flex flex-col justify-center px-4">
      <div className="my-4 max-w-full overflow-auto">
        <div className="flex flex-wrap">
          {months.map((month, index) => (
            <button
              key={index}
              className="mr-2 flex h-14 w-14 items-center justify-center rounded border-2 text-black hover:bg-gray-100"
              onClick={() => setSelectedMonth(addMonths(new Date(), month))}
            >
              {monthLabels[index]}
            </button>
          ))}
        </div>
      </div>
      <DaySelect
        selectedMonth={selectedMonth}
        startDate={startDate}
        endDate={endDate}
        setStartDate={(date) => handleDateChange(date, 'start')}
        setEndDate={(date: any) => handleDateChange(date, 'end')}
        setSelectedMonth={setSelectedMonth}
      />
      <button
        className="my-4 w-full rounded-2xl bg-[#B95FAB] p-2 text-lg font-semibold text-white"
        onClick={handleDateSave}
      >
        {startDate && endDate
          ? `${format(startDate, 'yyyy. M. d')} - ${format(endDate, 'M. d')} Search`
          : selectedMonth
            ? `Search`
            : '날짜 선택하기'}
      </button>
    </div>
  );
};

export default PeriodSelector;
