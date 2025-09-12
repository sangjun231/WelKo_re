import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// 이미지 분석을 위한 Gemini Vision 모델
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ImageAnalysisResult {
  description: string;
  tags: string[];
  confidence: number;
}

export interface TextGenerationResult {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

/**
 * 이미지를 분석하여 설명과 태그를 생성합니다
 * @param imageFile - 분석할 이미지 파일
 * @param prompt - 추가 프롬프트 (선택사항)
 * @returns 이미지 분석 결과
 */
export async function analyzeImage(imageFile: File, prompt?: string): Promise<ImageAnalysisResult> {
  try {
    // 이미지를 base64로 변환
    const imageData = await fileToGenerativePart(imageFile);

    const defaultPrompt = `
      이 이미지를 자세히 분석해주세요. 다음 정보를 제공해주세요:
      1. 이미지에 대한 상세한 설명 (한국어)
      2. 이미지의 주요 태그들 (관광지, 활동, 분위기 등)
      3. 관광지라면 추천 이유
      
      응답 형식:
      설명: [이미지 설명]
      태그: [태그1, 태그2, 태그3, ...]
      추천이유: [추천 이유]
    `;

    const result = await model.generateContent([prompt || defaultPrompt, imageData]);

    const response = await result.response;
    const text = response.text();

    // 응답 파싱
    const description = extractSection(text, '설명:');
    const tagsText = extractSection(text, '태그:');
    const tags = tagsText ? tagsText.split(',').map((tag) => tag.trim()) : [];
    const confidence = 0.85; // Gemini는 신뢰도 점수를 직접 제공하지 않으므로 기본값

    return {
      description,
      tags,
      confidence
    };
  } catch (error) {
    console.error('이미지 분석 중 오류 발생:', error);
    throw new Error('이미지 분석에 실패했습니다.');
  }
}

/**
 * 텍스트 생성을 위한 Gemini API 호출
 * @param prompt - 생성할 텍스트에 대한 프롬프트
 * @returns 생성된 텍스트
 */
export async function generateText(prompt: string): Promise<TextGenerationResult> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      usage: {
        promptTokens: prompt.length,
        completionTokens: text.length
      }
    };
  } catch (error) {
    console.error('텍스트 생성 중 오류 발생:', error);
    throw new Error('텍스트 생성에 실패했습니다.');
  }
}

/**
 * 관광지 추천을 위한 특화된 이미지 분석
 * @param imageFile - 분석할 이미지 파일
 * @returns 관광지 추천 정보
 */
export async function analyzeTouristSpot(imageFile: File) {
  const prompt = `
    이 이미지를 관광지 관점에서 분석해주세요:
    1. 장소의 이름이나 유형 (해변, 산, 도시, 문화재 등)
    2. 방문하기 좋은 계절이나 시간
    3. 주요 활동이나 체험
    4. 주변 관광지 추천
    5. 여행 팁
    
    응답 형식:
    장소유형: [유형]
    추천계절: [계절]
    주요활동: [활동들]
    주변관광지: [관광지들]
    여행팁: [팁들]
  `;

  return analyzeImage(imageFile, prompt);
}

/**
 * 파일을 Generative AI에서 사용할 수 있는 형태로 변환
 */
async function fileToGenerativePart(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(arrayBuffer).toString('base64'),
      mimeType: file.type
    }
  };
}

/**
 * 응답 텍스트에서 특정 섹션 추출
 */
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}\\s*([^\\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * API 사용량 확인 (Gemini는 현재 무료 티어 제공)
 */
export function getUsageInfo() {
  return {
    model: 'gemini-1.5-flash',
    freeTier: true,
    rateLimit: '15 requests per minute',
    note: 'Google AI Studio에서 무료로 사용 가능'
  };
}
