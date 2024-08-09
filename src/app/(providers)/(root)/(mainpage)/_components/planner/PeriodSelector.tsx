'use client';
import { addMonths, format } from 'date-fns';
import React, { useState } from 'react';
import DaySelect from '../planner/DaySelect';
import Image from 'next/image';

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

  // MMM와 yyyy를 분리하여 각각 스타일링할 준비
  const monthLabels = months.map((month) => {
    const monthDate = addMonths(new Date(), month);
    const monthPart = format(monthDate, 'MMM');
    const yearPart = format(monthDate, 'yyyy');
    return { monthPart, yearPart };
  });

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
    <div className="flex flex-col justify-center">
      <div className="my-4 max-w-full overflow-auto">
        <div className="grid grid-cols-3 place-items-center justify-center gap-2">
          {months.map((month, index) => (
            <button
              key={index}
              className="h-15 mr-2 flex w-20 flex-col items-center justify-center rounded border-2 text-black hover:bg-gray-100"
              onClick={() => setSelectedMonth(addMonths(new Date(), month))}
            >
              <Image
                src="/icons/tabler-icon-calendar-month.svg"
                alt="Calendar icon"
                width={24}
                height={24}
                className="mb-1"
              />
              <div className="flex flex-row items-center">
                <span className="mr-1 text-[13px] font-semibold">{monthLabels[index].monthPart}</span> {/* MMM 부분 */}
                <span className="text-[13px] text-[#939394]">{monthLabels[index].yearPart}</span> {/* yyyy 부분 */}
              </div>
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
          ? `${format(startDate, 'yy. M. d')} - ${format(endDate, 'M. d')} Search`
          : selectedMonth
            ? `Search`
            : '날짜 선택하기'}
      </button>
    </div>
  );
};

export default PeriodSelector;
