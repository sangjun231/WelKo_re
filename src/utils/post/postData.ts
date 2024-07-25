import { PostType } from '@/types/types';
import axios from 'axios';

// API 요청 함수
export const insertPostData = async ({
  user_id,
  title,
  content,
  image,
  maxPeople,
  tag,
  price,
  selectedPrices
}: PostType) => {
  try {
    const post = { user_id, title, content, image, maxPeople, tag, price, selectedPrices };
    const response = await axios.post('/api/post', post);
    alert('저장 완료!');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
