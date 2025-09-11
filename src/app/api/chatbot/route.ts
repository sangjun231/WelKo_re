import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 재시도 함수
async function retryWithDelay<T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.code === 'rate_limit_exceeded' && i < maxRetries - 1) {
        console.log(`속도 제한 초과. ${delay}ms 후 재시도... (${i + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // 지수 백오프
        continue;
      }
      throw error;
    }
  }
  throw new Error('최대 재시도 횟수 초과');
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: '메시지가 필요합니다.' }, { status: 400 });
    }

    const completion = await retryWithDelay(async () => {
      return await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              '당신은 WelKo 여행 플랫폼의 친근하고 도움이 되는 AI 어시스턴트입니다. 여행 관련 질문에 대해 친절하고 정확한 답변을 제공해주세요.'
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      });
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      message: response,
      role: 'assistant'
    });
  } catch (error: any) {
    console.error('OpenAI API 오류:', error);

    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json({ error: '서버가 혼잡합니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    }

    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ error: 'API 할당량이 부족합니다. 계정을 확인해주세요.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'AI 응답 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
