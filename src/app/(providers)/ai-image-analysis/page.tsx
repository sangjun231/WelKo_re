'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GeminiImageAnalyzer from '@/components/GeminiImageAnalyzer';
import { ImageAnalysisResult, ImageGenerationResult } from '@/services/geminiService';

export default function AIImageAnalysisPage() {
  const [analysisHistory, setAnalysisHistory] = useState<ImageAnalysisResult[]>([]);
  const [generatedImages, setGeneratedImages] = useState<ImageGenerationResult[]>([]);
  const [currentMode, setCurrentMode] = useState<'general' | 'tourist' | 'portrait'>('general');

  const handleAnalysisComplete = (result: ImageAnalysisResult) => {
    setAnalysisHistory((prev) => [result, ...prev]);
  };

  const handleImageGenerated = (result: ImageGenerationResult) => {
    setGeneratedImages((prev) => [result, ...prev]);
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    setGeneratedImages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">AI 이미지 분석 서비스</h1>
          <p className="mb-6 text-lg text-gray-600">Google Gemini AI를 활용한 스마트 이미지 분석</p>

          {/* 모드 선택 */}
          <div className="mb-6 flex justify-center gap-4">
            <button
              onClick={() => setCurrentMode('general')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                currentMode === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              일반 분석
            </button>
            <button
              onClick={() => setCurrentMode('tourist')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                currentMode === 'tourist'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              관광지 분석
            </button>
            <button
              onClick={() => setCurrentMode('portrait')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                currentMode === 'portrait'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              포트레이트 편집
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 분석기 */}
          <div>
            <GeminiImageAnalyzer
              mode={currentMode}
              onAnalysisComplete={handleAnalysisComplete}
              onImageGenerated={handleImageGenerated}
            />
          </div>

          {/* 분석 히스토리 */}
          <div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">분석 히스토리</h2>
                {analysisHistory.length > 0 && (
                  <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700">
                    전체 삭제
                  </button>
                )}
              </div>

              {analysisHistory.length === 0 && generatedImages.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>아직 분석한 이미지가 없습니다.</p>
                  <p className="text-sm">이미지를 업로드하여 분석을 시작해보세요!</p>
                </div>
              ) : (
                <div className="max-h-96 space-y-4 overflow-y-auto">
                  {analysisHistory.map((result, index) => (
                    <div key={`analysis-${index}`} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-gray-800">분석 #{analysisHistory.length - index}</h3>
                        <span className="text-xs text-gray-500">신뢰도 {(result.confidence * 100).toFixed(0)}%</span>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{result.description}</p>

                      {result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                              {tag}
                            </span>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              +{result.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 생성된 이미지 히스토리 */}
                  {generatedImages.map((result, index) => (
                    <div key={`generated-${index}`} className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-green-800">변환 #{generatedImages.length - index}</h3>
                        {result.usage && (
                          <span className="text-xs text-green-600">${result.usage.estimatedCost.toFixed(4)}</span>
                        )}
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-green-700">{result.description}</p>

                      {result.dimensions && (
                        <p className="mb-2 text-xs text-green-600">
                          해상도: {result.dimensions.width} × {result.dimensions.height}px
                        </p>
                      )}

                      <div className="mb-3 rounded-lg border bg-white p-2">
                        <Image
                          src={`data:image/png;base64,${result.generatedImage}`}
                          alt="Generated"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded object-cover"
                        />
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-green-600">
                          {result.usage ? `${result.usage.inputTokens} 토큰` : '토큰 정보 없음'}
                        </span>
                        <a
                          href={`data:image/png;base64,${result.generatedImage}`}
                          download={`generated-${index + 1}.png`}
                          className="text-xs text-green-600 hover:text-green-800"
                        >
                          다운로드
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">스마트 이미지 인식</h3>
            <p className="text-sm text-gray-600">Google Gemini AI의 최신 비전 모델로 정확한 이미지 분석</p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">관광지 특화 분석</h3>
            <p className="text-sm text-gray-600">여행 관련 정보와 추천을 제공하는 전문 분석 모드</p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">포트레이트 편집</h3>
            <p className="text-sm text-gray-600">태그 클릭으로 간편한 배경 변경과 이미지 변환</p>
          </div>

          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">빠른 처리 속도</h3>
            <p className="text-sm text-gray-600">실시간 분석과 즉시 결과 확인이 가능한 고속 처리</p>
          </div>
        </div>
      </div>
    </div>
  );
}
