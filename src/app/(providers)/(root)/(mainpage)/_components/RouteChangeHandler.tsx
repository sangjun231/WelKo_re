'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function RouteChangeHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && !pathname.startsWith('/postpage/')) {
        const keysToRemove = ['postId', 'startDate', 'endDate', 'day1', 'day2', 'day3', 'userId'];
        keysToRemove.forEach((key) => {
          sessionStorage.removeItem(key);
        });
      }
    };

    handleRouteChange();
  }, [pathname, searchParams]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
}
