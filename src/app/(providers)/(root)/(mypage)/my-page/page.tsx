"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const MyPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('@/app/api/mypage/route');
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      {/* 데이터를 적절히 렌더링 */}
      {data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default MyPage;
