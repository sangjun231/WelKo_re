import { useState } from 'react';

type DayNumbers = { [key: string]: number[] };

const useDayNumbers = () => {
  const [dayNumbers, setDayNumbers] = useState<DayNumbers>({});

  // Day를 선택했을 때, 초기 버튼(번호)을 설정
  const handleDaySelect = (day: string) => {
    if (!dayNumbers[day]) {
      // 해당 Day에 번호가 없으면
      setDayNumbers((prev) => ({
        ...prev,
        [day]: [1] // 첫 번째 버튼 번호를 1로 초기화
      }));
    }
    console.log(dayNumbers);
  };

  // 새로운 장소(번호)를 추가할 때 호출되는 함수
  const addDayNumber = (day: string) => {
    setDayNumbers((prev) => {
      const currentNumbers = prev[day] || []; // 현재 Day의 번호 배열
      if (currentNumbers.length < 6) {
        // 최대 6개까지 버튼 추가
        const newNumbers = [...currentNumbers, currentNumbers.length + 1];
        return { ...prev, [day]: newNumbers }; // 새로운 번호 배열로 업데이트
      }
      return prev; // 최대 버튼 개수를 초과하면 상태 변화 없음
    });
  };

  return { dayNumbers, handleDaySelect, addDayNumber };
};

export default useDayNumbers;
