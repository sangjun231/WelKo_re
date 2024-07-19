'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import supabase from '@/supabase/client';

type Review = {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  rating: number;
};

const MyPage = () => {
  const [data, setData] = useState<Review[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/mypage');
        setData(response.data);
      } catch (error: any) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  console.log(data);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.content}</h2>
          <p>Rating: {item.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default MyPage;
