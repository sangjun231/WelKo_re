export const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  if (!startDate || !endDate) return 'N/A';

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatMonthDay = (date: Date) => `${date.getMonth() + 1}.${date.getDate()}`;

  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getFullYear().toString().slice(2)}.${formatMonthDay(start)} - ${formatMonthDay(end)}`;
  } else {
    return `${start.getFullYear().toString().slice(2)}.${formatMonthDay(start)} - ${end.getFullYear().toString().slice(2)}.${formatMonthDay(end)}`;
  }
};
