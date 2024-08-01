import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns';
import React from 'react';

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

  // Ensure selectedMonth is a valid Date object
  if (!(selectedMonth instanceof Date) || isNaN(selectedMonth.getTime())) {
    return <div>Invalid month selected</div>;
  }

  // Create dates for the selected month
  const startMonth = startOfMonth(selectedMonth);
  const endMonth = endOfMonth(selectedMonth);

  // Calculate the start and end dates for the calendar grid
  const startCalendar = startOfWeek(startMonth, { weekStartsOn: 0 }); // Start from Sunday
  const endCalendar = endOfWeek(endMonth, { weekStartsOn: 0 });

  // Generate dates for the calendar grid
  const daysInCalendar = Array.from(
    { length: (endCalendar.getTime() - startCalendar.getTime()) / (1000 * 60 * 60 * 24) + 1 },
    (_, i) => new Date(startCalendar.getFullYear(), startCalendar.getMonth(), startCalendar.getDate() + i)
  );

  // Check if a date is disabled (before today)
  const isDateDisabled = (date: Date) => isBefore(startOfDay(date), today);

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate) {
      if (isAfter(date, startDate)) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    } else {
      setStartDate(date);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex justify-between text-center font-bold">
        <button onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))} className="rounded bg-gray-300 px-2 py-1">
          &lt;
        </button>
        {format(selectedMonth, 'yyyy년 MMMM')}
        <button onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))} className="rounded bg-gray-300 px-2 py-1">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInCalendar.map((day) => (
          <button
            key={day.toDateString()}
            onClick={() => handleDateClick(day)}
            className={`rounded-md p-2 ${
              isDateDisabled(day)
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : startDate && endDate && day >= startDate && day <= endDate
                  ? 'bg-blue-500 text-white'
                  : startDate && day.toDateString() === startDate.toDateString()
                    ? 'bg-green-500 text-white'
                    : endDate && day.toDateString() === endDate.toDateString()
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-black'
            } ${isDateDisabled(day) ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
            disabled={isDateDisabled(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DaySelect;
