import { addMonths, endOfMonth, endOfWeek, isAfter, isBefore, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import React from 'react';
import toast from 'react-hot-toast';
import { MonthCalendar } from './MonthCalendar';

interface DaySelectProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const DaySelect: React.FC<DaySelectProps> = ({
  selectedMonth,
  setSelectedMonth,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}) => {
  const today = startOfDay(new Date());

  if (!(selectedMonth instanceof Date) || isNaN(selectedMonth.getTime())) {
    return <div>Invalid month selected</div>;
  }

  //기본 달력 (현재 달)
  const startMonth = startOfMonth(selectedMonth);
  const endMonth = endOfMonth(selectedMonth);
  const startCalendar = startOfWeek(startMonth, { weekStartsOn: 0 }); // Start from Sunday
  const endCalendar = endOfWeek(endMonth, { weekStartsOn: 0 });
  const daysInCalendar = Array.from(
    { length: (endCalendar.getTime() - startCalendar.getTime()) / (1000 * 60 * 60 * 24) + 1 },
    (_, i) => new Date(startCalendar.getFullYear(), startCalendar.getMonth(), startCalendar.getDate() + i)
  );
  //웹 전용 달력 (다음 달)
  const nextMonth = addMonths(selectedMonth, 1); // 다음 달로 이동
  const nextStartMonth = startOfMonth(nextMonth); // 다음 달의 첫 번째 날
  const nextEndMonth = endOfMonth(nextMonth);
  const nextStartCalendar = startOfWeek(nextStartMonth, { weekStartsOn: 0 }); // Start from Sunday
  const nextEndCalendar = endOfWeek(nextEndMonth, { weekStartsOn: 0 });
  const daysInNextMonthCalendar = Array.from(
    { length: (nextEndCalendar.getTime() - nextStartCalendar.getTime()) / (1000 * 60 * 60 * 24) + 1 },
    (_, i) => new Date(nextStartCalendar.getFullYear(), nextStartCalendar.getMonth(), nextStartCalendar.getDate() + i)
  );

  const isDateDisabled = (date: Date) => isBefore(startOfDay(date), today);

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate) {
      const newEndDate = isAfter(date, startDate) ? date : startDate;
      const newStartDate = isAfter(date, startDate) ? startDate : date;

      // 선택된 날짜가 7일을 초과하지 않도록 제한
      if ((newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24) < 7) {
        setEndDate(newEndDate);
      } else {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          toast('You cannot select more than 7 days!', {
            duration: 3000,
            position: 'bottom-center',
            style: {
              background: '#333',
              color: '#fff',
              marginBottom: '100px',
              borderRadius: '70px',
              padding: '10px 20px'
            }
          });
        } else {
          alert('You cannot select more than 7 days!'); // Web 환경
        }
        setEndDate(null); // 7일을 초과하면 선택 해제
      }
    } else {
      setStartDate(date);
    }
  };

  return (
    <div className="web:mx-20 web:flex web:gap-20">
      <div className="web:w-full">
        <MonthCalendar
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          startDate={startDate}
          endDate={endDate}
          handleDateClick={handleDateClick}
          daysInCalendar={daysInCalendar} // daysInCalendar에 해당 월의 날짜들 전달
          isDateDisabled={isDateDisabled}
        />
      </div>
      <div className="hidden web:block web:w-full">
        <MonthCalendar
          selectedMonth={nextMonth}
          setSelectedMonth={setSelectedMonth}
          startDate={startDate}
          endDate={endDate}
          handleDateClick={handleDateClick}
          daysInCalendar={daysInNextMonthCalendar} // daysInCalendar에 해당 월의 날짜들 전달
          isDateDisabled={isDateDisabled}
        />
      </div>
    </div>
  );
};

export default DaySelect;
