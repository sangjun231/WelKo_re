import { useState } from 'react';

type DayNumbers = { [key: string]: number[] };

const useDayNumbers = () => {
  const [dayNumbers, setDayNumbers] = useState<DayNumbers>({});

  const handleDaySelect = (day: string) => {
    setDayNumbers((prev) => {
      if (!prev[day]) {
        return {
          ...prev,
          [day]: [1] // 첫 번째 버튼 번호를 1로 초기화
        };
      }
      return prev;
    });
  };

  const addDayNumber = (day: string) => {
    setDayNumbers((prev) => {
      const currentNumbers = prev[day] || [];
      if (currentNumbers.length < 6) {
        const newNumbers = [...currentNumbers, currentNumbers.length + 1];
        return { ...prev, [day]: newNumbers };
      }
      return prev;
    });
  };

  return { dayNumbers, handleDaySelect, addDayNumber };
};

export default useDayNumbers;
