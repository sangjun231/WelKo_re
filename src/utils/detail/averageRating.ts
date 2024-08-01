export const averageRatings = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return parseFloat(average.toFixed(2)); // 소수점 한 자리로 고정 후 숫자로 변환
};
