import { DateType, PostType } from '@/types/types';
import axios from 'axios';

// 일정 날짜 선택- API 요청 함수
export const upsertPostData = async ({ user_id, startDate, endDate }: DateType) => {
  try {
    const datePost = { user_id, startDate, endDate };
    const response = await axios.post('/api/post', datePost);
    alert('날짜 저장!');
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

// 일정 세부사항 작성- API 요청 함수
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
