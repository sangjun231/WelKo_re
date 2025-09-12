import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, analyzeTouristSpot } from '@/services/geminiService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const mode = formData.get('mode') as string;

    if (!image) {
      return NextResponse.json({ error: '이미지 파일이 필요합니다.' }, { status: 400 });
    }

    // 이미지 파일 타입 검증
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 파일 크기 제한 (10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하여야 합니다.' }, { status: 400 });
    }

    let result;
    if (mode === 'tourist') {
      result = await analyzeTouristSpot(image);
    } else {
      result = await analyzeImage(image);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json({ error: '이미지 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Gemini 이미지 분석 API',
    endpoints: {
      POST: '/api/gemini/analyze',
      parameters: {
        image: 'File (required) - 이미지 파일',
        mode: 'string (optional) - "tourist" 또는 "general"'
      }
    }
  });
}

