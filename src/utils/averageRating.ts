export const averageRatings = (reviews: { rating: number }[]): string => {
  if (reviews.length === 0) return 'N/A';
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return average.toFixed(1);
};
