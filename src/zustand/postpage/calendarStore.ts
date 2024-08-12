import create from 'zustand';

interface CalendarState {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedMonth: new Date(),
  setSelectedMonth: (date: Date) => set({ selectedMonth: date }),
  startDate: null,
  setStartDate: (date: Date | null) => set({ startDate: date }),
  endDate: null,
  setEndDate: (date: Date | null) => set({ endDate: date })
}));
