import React from 'react';
import { format, isBefore, isAfter, startOfDay, endOfMonth, startOfMonth, endOfWeek, startOfWeek, addMonths, subMonths } from 'date-fns';

interface DaySelectProps {
  selectedMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

const DaySelect: React.FC<DaySelectProps> = ({
  selectedMonth,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
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
      <div className="text-center font-bold mb-2">
        {format(selectedMonth, 'yyyy년 MMMM')}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysInCalendar.map((day) => (
          <button
            key={day.toDateString()}
            onClick={() => handleDateClick(day)}
            className={`p-2 rounded-md ${
              isDateDisabled(day)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setStartDate(startOfDay(subMonths(selectedMonth, 1)))}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          &lt;
        </button>
        <button
          onClick={() => setStartDate(startOfDay(addMonths(selectedMonth, 1)))}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DaySelect;
