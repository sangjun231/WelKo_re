import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const daysAgo = differenceInDays(now, date);

  if (daysAgo >= 7) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
  } else if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  } else {
    const hoursAgo = differenceInHours(now, date);
    if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      const minutesAgo = differenceInMinutes(now, date);
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  }
};
