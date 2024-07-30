import { Tables } from '@/types/supabase';
import axios from 'axios';

export const upsertDate = async (datePostData: Partial<Tables<'posts'>>) => {
  try {
    const response = await axios.post('/api/post', datePostData);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const updatePostDetails = async (postDetails: Partial<Tables<'posts'>>) => {
  try {
    const response = await axios.put('/api/post', postDetails);
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

export const savePlaces = async (placesDetails: Partial<Tables<'schedule'>>) => {
  try {
    const response = await axios.post('/api/search', placesDetails);
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
