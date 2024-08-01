'use client';
import { updatePostDetails } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Write = ({ goToStep2 }: { goToStep2: () => void }) => {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [maxPeople, setMaxPeople] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [tags, setTags] = useState<string[]>([]);
  const tagData = [
    'Activities', //체험과 액티비티
    'Popular Places', // 유명 핫플레이스
    'With Nature', // 자연과 함께
    'Tourist Spots', // 관광지
    'Relax and Leisurely', // 한적, 여유
    'Shopping', // 쇼핑
    'Must-Visit Restaurants', // 맛집
    'Cultural Exploration' // 문화 탐방
  ];
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const prices = ['Accommodation', 'Meals', 'Leisure Activities', 'Transportation'];
  //순서대로 숙소비, 식사비, 레저비, 교통비

  const handleFormConfirm = () => {
    const missingFields: string[] = [];

    if (!title.trim()) missingFields.push('제목');
    if (!content.trim()) missingFields.push('내용');
    if (!image) missingFields.push('이미지');
    if (!maxPeople || maxPeople < 1) missingFields.push('최대 인원');
    if (!price || price < 0) missingFields.push('투어 금액');
    if (tags.length === 0) missingFields.push('투어 태그');
    if (selectedPrices.length === 0) missingFields.push('가격 옵션');

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      alert(`다음 정보를 입력해주세요: ${missingFieldsString}`);
      return false;
    }
    return true;
  };

  //이미지 추가하는 핸들러
  const handleImageAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  //최대 인원 추가하는 핸들러, value 값을 숫자로 저장하는 핸들러
  const handleMaxPeopleAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10); // 10진수로 변환
    if (!isNaN(value)) {
      setMaxPeople(value);
    }
  };
  //투어 금액 추가하는 핸들러, value 값을 숫자로 저장하는 핸들러
  const handlePriceAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10); // 10진수로 변환
    if (!isNaN(value)) {
      setPrice(value);
    }
  };
  //태그 선택하는 핸들러
  const toggleTag = (item: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (tags.includes(item)) {
      setTags(tags.filter((i) => i !== item));
    } else {
      if (tags.length < 4) {
        setTags([...tags, item]);
      } else {
        alert('태그는 최대 4개까지 선택할 수 있습니다.');
      }
    }
  };
  //포함되는 비용 선택하는 핸들러
  const togglePrice = (item: string) => {
    if (selectedPrices.includes(item)) {
      setSelectedPrices(selectedPrices.filter((i) => i !== item));
    } else {
      setSelectedPrices([...selectedPrices, item]);
    }
  };

  const addMutation = useMutation({
    mutationFn: updatePostDetails
  });

  const handleSavePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postId = sessionStorage.getItem('postId');

    if (!postId) {
      console.error('Post ID not found');
      return;
    }
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return;
    }

    if (!handleFormConfirm()) {
      // 폼이 유효하지 않으면 여기서 함수 종료
      return;
    }

    addMutation.mutate({
      name: user?.user_metadata.name,
      id: postId,
      title,
      content,
      image,
      maxPeople,
      tags,
      price,
      selectedPrices
    });
    alert('Saved!');
    router.replace('/');
    sessionStorage.clear();
  };

  return (
    <form onSubmit={handleSavePost}>
      <div className="my-4 flex">
        <button onClick={goToStep2}>
          <FaArrowLeft className="m-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-semibold">지역 가져와서- 투어</h1>
        </div>
      </div>
      {/* 제목, 내용 입력 폼 */}
      <div className="flex flex-col">
        <label>제목</label>
        <input
          className="border"
          type="text"
          placeholder="투어 제목을 작성해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>내용</label>
        <textarea
          className="h-[150px] resize-none border"
          placeholder="투어 내용을 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {/* 이미지 등록 */}
      <div>
        <div className="flex items-center">
          <label
            htmlFor="input-file"
            className="flex h-[150px] w-[150px] cursor-pointer items-center justify-center border"
          >
            <Image src="/icons/upload.png" alt="upload icon" width={70} height={70} />
          </label>
          {image && <Image src={image} alt="uploaded" width={150} height={150} className="border p-2" />}
        </div>
        <input type="file" id="input-file" onChange={handleImageAdd} className="hidden" />
      </div>

      {/* 최대 인원 작성 */}
      <hr className="my-5" />
      <div>
        <h1>최대 인원</h1>
        <input type="number" value={maxPeople} onChange={handleMaxPeopleAdd} min={1} />명
      </div>

      {/* 투어 태그 선택 */}
      <hr className="my-5" />
      <div>
        <h1>어떤 투어인가요?</h1>
        <div className="flex flex-wrap gap-2">
          {tagData.map((item) => (
            <button
              key={item}
              className={`rounded-full border px-4 py-2 ${tags.includes(item) ? 'bg-gray-200' : 'bg-white'}`}
              onClick={(e) => toggleTag(item, e)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 투어 금액 작성 및 체크박스 선택 */}
      <hr className="my-5" />
      <div>
        <h1>투어 금액</h1>
        <input type="number" value={price} onChange={handlePriceAdd} min={0} />원
        <div className="flex flex-wrap">
          {prices.map((item) => (
            <label key={item} className="mr-4">
              <input
                type="checkbox"
                checked={selectedPrices.includes(item)}
                onChange={() => togglePrice(item)}
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="my-4 w-full rounded bg-black p-2 text-white">
        저장하기
      </button>
    </form>
  );
};

export default Write;
