'use client';
import { addMonths, format, startOfDay } from 'date-fns';
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

  return (
    <div className="flex flex-col justify-center">
      <div className="my-4 overflow-x-auto sm:max-w-[246px]">
        <div className="flex flex-nowrap">
          {months.map((month, index) => (
            <button
              key={index}
              className="w-16 h-16 flex items-center justify-center rounded border-2 text-black hover:bg-gray-100 mr-2"
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

export default PeriodSelector;
