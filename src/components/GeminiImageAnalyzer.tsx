'use client';

import React, { useState, useRef } from 'react';
import { analyzeImage, analyzeTouristSpot, ImageAnalysisResult } from '@/services/geminiService';
import { toast } from 'react-hot-toast';

interface GeminiImageAnalyzerProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
  mode?: 'general' | 'tourist';
}

export default function GeminiImageAnalyzer({ onAnalysisComplete, mode = 'general' }: GeminiImageAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-bold">
        {mode === 'tourist' ? '관광지 이미지 분석' : 'AI 이미지 분석'}
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
                <h4 className="mb-2 font-medium text-gray-700">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, index) => (
                    <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
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

      {/* 사용법 안내 */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-blue-800">💡 사용 팁</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• 명확하고 선명한 이미지를 업로드하면 더 정확한 분석이 가능합니다</li>
          <li>• 관광지 모드에서는 여행 관련 정보를 더 자세히 제공합니다</li>
          <li>• Gemini API는 무료로 사용할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
