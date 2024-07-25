'use client';

import React, { useState } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../../../../../hooks/useKakaoLoader';

export default function KakaoMapPage() {
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useKakaoLoader();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      setTags([...tags, `#${tagInput.trim()}`]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div>
          <label htmlFor="title">여행제목</label>
          <input type="text" id="title" placeholder="1박2일 서울 맛집 탐방" />
        </div>
        <div>
          <label htmlFor="image">여행대표사진설정</label>
          <input type="file" id="image" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview as string} alt="사진 미리보기" style={{ marginTop: '10px', maxWidth: '100%' }} />
          )}
        </div>
        <div>
          <label htmlFor="startDate">여행 시작 날짜</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="endDate">여행 끝나는 날짜</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">설명</label>
          <input type="text" id="description" placeholder="여행 상세 설명을 넣어 주세요" />
        </div>
        <div>
          <label htmlFor="tags">태그</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {tags.map((tag, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#e1e1e1',
                  padding: '5px',
                  borderRadius: '5px'
                }}
              >
                <span>{tag}</span>
                <button type="button" onClick={() => removeTag(index)} style={{ marginLeft: '5px', cursor: 'pointer' }}>
                  x
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            id="tagInput"
            placeholder="태그를 입력 후 엔터를 누르세요"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Map // 지도를 표시할 Container
          id="map"
          center={{
            // 지도의 중심좌표
            lat: 33.450701,
            lng: 126.570667
          }}
          style={{
            // 지도의 크기
            width: '100%',
            height: '350px'
          }}
          level={3} // 지도의 확대 레벨
        />
      </div>
    </div>
  );
}
