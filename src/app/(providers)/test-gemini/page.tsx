'use client';

import React from 'react';
import GeminiImageAnalyzer from '@/components/GeminiImageAnalyzer';

export default function TestGeminiPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold">Gemini API 테스트</h1>
        <GeminiImageAnalyzer mode="general" />
      </div>
    </div>
  );
}

