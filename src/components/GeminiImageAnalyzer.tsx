'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  analyzeImage,
  analyzeTouristSpot,
  ImageAnalysisResult,
  generateImageFromText,
  changePortraitBackground,
  ImageGenerationResult
} from '@/services/geminiService';
import { toast } from 'react-hot-toast';

interface GeminiImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
  onImageGenerated?: (result: ImageGenerationResult) => void;
  mode?: 'general' | 'tourist' | 'portrait';
}

export default function GeminiImageAnalyzer({
  onAnalysisComplete,
  onImageGenerated,
  mode = 'general'
}: GeminiImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 배경 스타일 옵션
  const backgroundOptions = [
    { value: 'professional studio', label: '프로페셔널 스튜디오' },
    { value: 'natural outdoor', label: '자연 배경' },
    { value: 'gradient background', label: '그라데이션 배경' },
    { value: 'vintage retro', label: '빈티지 레트로' },
    { value: 'modern minimalist', label: '모던 미니멀' }
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      setSelectedImage(file);
      setResult(null);
      setGeneratedImage(null);
      setOriginalImageUrl('');

      // 원본 이미지 URL 생성
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('이미지를 선택해주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      let analysisResult: ImageAnalysisResult;

      if (mode === 'tourist') {
        analysisResult = await analyzeTouristSpot(selectedImage);
      } else {
        analysisResult = await analyzeImage(selectedImage);
      }

      setResult(analysisResult);
      onAnalysisComplete?.(analysisResult);
      toast.success('이미지 분석이 완료되었습니다!');
    } catch (error) {
      console.error('분석 오류:', error);
      toast.error('이미지 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackgroundChange = async (backgroundStyle?: string) => {
    const style = backgroundStyle || selectedBackground;
    if (!selectedImage || !style) {
      toast.error('이미지와 배경 스타일을 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await changePortraitBackground(selectedImage, style);
      setGeneratedImage(result);
      onImageGenerated?.(result);
      toast.success('배경 변경이 완료되었습니다!');
    } catch (error) {
      console.error('배경 변경 오류:', error);
      toast.error('배경 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTagClick = (tag: string) => {
    // 태그를 배경 스타일로 변환
    const backgroundMapping: { [key: string]: string } = {
      실내: 'professional studio',
      야외: 'natural outdoor',
      자연: 'natural outdoor',
      스튜디오: 'professional studio',
      빈티지: 'vintage retro',
      모던: 'modern minimalist',
      그라데이션: 'gradient background',
      미니멀: 'modern minimalist'
    };

    const backgroundStyle = backgroundMapping[tag] || 'professional studio';
    setSelectedBackground(backgroundStyle);
    handleBackgroundChange(backgroundStyle);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setGeneratedImage(null);
    setSelectedBackground('');
    setOriginalImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold">
        {mode === 'tourist' ? '관광지 이미지 분석' : mode === 'portrait' ? '포트레이트 AI 편집' : 'AI 이미지 분석'}
      </h2>

      {/* 이미지 업로드 영역 */}
      <div className="mb-6">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center">
            <svg className="mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mb-2 text-gray-600">이미지를 클릭하거나 드래그하여 업로드</p>
            <p className="text-sm text-gray-400">JPG, PNG, GIF 파일 (최대 10MB)</p>
          </label>
        </div>

        {selectedImage && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedImage.name}</p>
                <p className="text-sm text-gray-500">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={handleReset} className="text-red-500 hover:text-red-700">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 분석 버튼 */}
      <div className="mb-6 text-center">
        <button
          onClick={handleAnalyze}
          disabled={!selectedImage || isAnalyzing}
          className={`rounded-lg px-8 py-3 font-medium transition-colors ${
            !selectedImage || isAnalyzing
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center">
              <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              분석 중...
            </div>
          ) : (
            '이미지 분석하기'
          )}
        </button>
      </div>

      {/* 포트레이트 모드: 배경 선택 */}
      {mode === 'portrait' && selectedImage && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">배경 스타일 선택</h3>
          <div className="grid grid-cols-2 gap-2">
            {backgroundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedBackground(option.value)}
                className={`rounded-lg border p-3 text-sm transition-colors ${
                  selectedBackground === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => handleBackgroundChange()}
              disabled={!selectedBackground || isGenerating}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                !selectedBackground || isGenerating
                  ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  변환 중...
                </div>
              ) : (
                '배경 변경하기'
              )}
            </button>
          </div>
        </div>
      )}

      {/* 분석 결과 */}
      {result && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">분석 결과</h3>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-gray-700">설명</h4>
              <p className="text-gray-600">{result.description}</p>
            </div>

            {result.tags.length > 0 && (
              <div>
                <h4 className="mb-2 font-medium text-gray-700">태그 (클릭하여 배경 변경)</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => handleTagClick(tag)}
                      disabled={isGenerating}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        isGenerating
                          ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                          : 'cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">💡 태그를 클릭하면 해당 스타일로 배경이 변경됩니다</p>
              </div>
            )}

            <div>
              <h4 className="mb-2 font-medium text-gray-700">신뢰도</h4>
              <div className="flex items-center">
                <div className="mr-3 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: `${result.confidence * 100}%` }}></div>
                </div>
                <span className="text-sm text-gray-600">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 비교 뷰 */}
      {generatedImage && originalImageUrl && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">이미지 비교</h3>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-gray-700">변환 프롬프트</h4>
              <p className="text-sm text-gray-600">{generatedImage.prompt}</p>
            </div>

            {generatedImage.dimensions && (
              <div>
                <h4 className="mb-2 font-medium text-gray-700">이미지 해상도</h4>
                <p className="text-sm text-gray-600">
                  {generatedImage.dimensions.width} × {generatedImage.dimensions.height} 픽셀
                </p>
              </div>
            )}

            {/* 원본 vs 변환된 이미지 비교 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 원본 이미지 */}
              <div className="rounded-lg border bg-white p-4">
                <h5 className="mb-2 text-center font-medium text-gray-700">원본 이미지</h5>
                <Image
                  src={originalImageUrl}
                  alt="Original image"
                  width={300}
                  height={300}
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              </div>

              {/* 변환된 이미지 */}
              <div className="rounded-lg border bg-white p-4">
                <h5 className="mb-2 text-center font-medium text-gray-700">변환된 이미지</h5>
                <Image
                  src={`data:image/png;base64,${generatedImage.generatedImage}`}
                  alt="Generated image"
                  width={300}
                  height={300}
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
              </div>
            </div>

            {/* 다운로드 버튼들 */}
            <div className="flex justify-center gap-4">
              <a
                href={originalImageUrl}
                download="original-image.png"
                className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                원본 다운로드
              </a>
              <a
                href={`data:image/png;base64,${generatedImage.generatedImage}`}
                download="transformed-image.png"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                변환된 이미지 다운로드
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 비용 정보 표시 */}
      {generatedImage?.usage && (
        <div className="mt-6 rounded-lg bg-green-50 p-4">
          <h4 className="mb-2 font-medium text-green-800">💰 사용량 정보</h4>
          <div className="text-sm text-green-700">
            <p>• 입력 토큰: {generatedImage.usage.inputTokens.toLocaleString()}개</p>
            <p>• 출력 토큰: {generatedImage.usage.outputTokens.toLocaleString()}개</p>
            <p>• 예상 비용: ${generatedImage.usage.estimatedCost.toFixed(4)}</p>
            {generatedImage.dimensions && (
              <p>
                • 해상도: {generatedImage.dimensions.width} × {generatedImage.dimensions.height}px
              </p>
            )}
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-blue-800">💡 사용 팁</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• 명확하고 선명한 이미지를 업로드하면 더 정확한 분석이 가능합니다</li>
          <li>• 분석 결과의 태그를 클릭하면 해당 스타일로 배경이 변경됩니다</li>
          <li>• 원본과 변환된 이미지를 비교하여 결과를 확인할 수 있습니다</li>
          <li>• 포트레이트 모드에서는 배경 변경 기능을 사용할 수 있습니다</li>
          <li>• Gemini 2.5 Flash Image 유료 플랜 사용 중 (이미지당 약 $0.04-0.08)</li>
        </ul>
      </div>
    </div>
  );
}
