'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! WelKo 여행 어시스턴트입니다. 여행에 대해 궁금한 점이 있으시면 언제든 물어보세요! 🧳✈️'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 다시 시도해주세요.'
          }
        ]);
      }
    } catch (error) {
      console.error('챗봇 오류:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-500 hover:bg-primary-600 fixed bottom-4 right-16 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors"
      >
        <Image
          src="/icons/tabler-icon-location-filled.svg"
          alt="챗봇"
          width={24}
          height={24}
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-16 z-40 h-96 w-80 rounded-lg border bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-lg border-b bg-primary-50 p-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full">
                <Image
                  src="/icons/tabler-icon-location-filled.svg"
                  alt="챗봇"
                  width={16}
                  height={16}
                  style={{ width: '16px', height: '16px' }}
                />
              </div>
              <span className="font-semibold text-primary-900">WelKo AI 어시스턴트</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              <Image
                src="/icons/tabler-icon-x.svg"
                alt="닫기"
                width={16}
                height={16}
                style={{ width: '16px', height: '16px' }}
              />
            </button>
          </div>

          <div className="h-80 flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-gray-100 px-4 py-2 text-gray-900">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="focus:ring-primary-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image
                  src="/icons/tabler-icon-send.svg"
                  alt="전송"
                  width={16}
                  height={16}
                  style={{ width: '16px', height: '16px' }}
                />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
