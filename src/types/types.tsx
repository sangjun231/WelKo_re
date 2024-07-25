// 어떤 방식인지???
export const Posts = Tables<'posts'>;

//postpage
export type PostType = {
  user_id: string;
  title: string;
  content: string;
  image: string;
  maxPeople: number;
  tag: string[];
  price: number;
  selectedPrices: string[];
};
