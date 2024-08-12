import { useCalendarStore } from '@/zustand/postpage/calendarStore';
import { format, startOfDay } from 'date-fns';

interface DateSaveButtonProps {
  onClick: () => void;
}

const DateSaveButton = ({ onClick }: DateSaveButtonProps) => {
  const { startDate, endDate, selectedMonth } = useCalendarStore();

  return (
    <button className="mx-auto mb-5 h-14 w-[288px] rounded-2xl bg-primary-300 p-2 text-lg text-white" onClick={onClick}>
      {startDate && endDate
        ? `${format(startOfDay(startDate), 'yy. M. d')} - ${format(startOfDay(endDate), 'M. d')} Select`
        : selectedMonth
          ? `${format(selectedMonth, 'yyyy MMM')} Select`
          : 'Select'}
    </button>
  );
};

export default DateSaveButton;
