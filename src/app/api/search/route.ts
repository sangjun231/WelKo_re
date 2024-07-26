import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('Query:', query);

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const url = 'https://openapi.naver.com/v1/search/local.json';
    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID!,
      'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET!
    };

    const response = await axios.get(url, {
      headers,
      params: {
        query,
        display: 5, // 검색 결과 개수
        start: 1,
        sort: 'random' // 정렬 기준
      }
    });
    console.log('Naver API Response:', response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response data:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error headers:', error.response?.headers);
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json({ error: 'An error occurred while searching for places' }, { status: 500 });
  }
}
