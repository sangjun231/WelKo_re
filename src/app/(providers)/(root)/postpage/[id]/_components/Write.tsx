'use client';
import { formatDateRange } from '@/utils/detail/functions';
import { insertPostDetails, savePlaces, updatePlaces, updatePostDetails } from '@/utils/post/postData';
import { createClient } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BiDollar } from 'react-icons/bi';
import { IoChevronBack, IoCloseOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';

const Write = ({
  goToStep2,
  region,
  postId,
  userId
}: {
  goToStep2: () => void;
  region: string;
  postId: string;
  userId: string;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [maxPeople, setMaxPeople] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const tagData = [
    'Activities', //체험과 액티비티
    'Famous', // 유명 핫플레이스
    'Nature', // 자연과 함께
    'Tourist Attraction', // 관광지
    'Peaceful', // 한적, 여유
    'Shopping', // 쇼핑
    'Mukbang', // 맛집
    'Culture/Art', // 문화 탐방
    'K-Drama Location'
  ];
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const prices = ['Room charge', 'Restaurant', 'Ticket', 'Transportation'];
  //순서대로 숙소비, 식사비, 레저비, 교통비
  const [editId, setEditId] = useState<string>('');
  const startDate = sessionStorage.getItem('startDate');
  const endDate = sessionStorage.getItem('endDate');

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!postId) return;
      const supabase = createClient();
      const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single();
      if (!data || data.id !== postId) {
        return;
      }
      if (data) {
        // 불러온 데이터를 상태로 설정
        setTitle(data.title || '');
        setContent(data.content || '');
        setImage(data.image || '');
        setMaxPeople(data.maxPeople || 0);
        setPrice(data.price || 0);
        setTags(data.tags || []);
        setSelectedPrices(data.selectedPrices || []);
        setEditId(data.id);
      } else if (error) {
        console.error('Error fetching post data:', error);
        return;
      }
    };
    fetchPlaces();
  }, [postId]);

  const handleFormConfirm = () => {
    const missingFields: string[] = [];
    if (!title.trim()) missingFields.push('제목');
    if (!content.trim()) missingFields.push('내용');
    if (!image) missingFields.push('이미지');
    if (!maxPeople || maxPeople < 1) missingFields.push('최대 인원');
    if (!price || price < 1) missingFields.push('투어 금액');
    if (tags.length === 0) missingFields.push('투어 태그');
    if (selectedPrices.length === 0) missingFields.push('가격 옵션');
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      alert(`다음 정보를 입력해주세요: "${missingFieldsString}"`);
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    const userConfirmed = confirm('Do you want to cancel this?');
    if (!userConfirmed) {
      return;
    }
    router.replace('/');
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
  //이미지 취소 핸들러
  const handleImageRemove = () => {
    setImage('');
  };
  //최대 인원 추가하는 핸들러, value 값을 숫자로 저장하는 핸들러
  const handleMaxPeopleAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 입력값이 빈 문자열인 경우
    if (value === '') {
      setMaxPeople(undefined); // 상태를 undefined로 설정하여 빈값 허용
    } else {
      // 숫자일 경우
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setMaxPeople(parsedValue);
      }
    }
  };
  //투어 금액 추가하는 핸들러, value 값을 숫자로 저장하는 핸들러
  const handlePriceAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setPrice(undefined);
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setPrice(parsedValue);
      }
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

  // 상세 내용 작성 (post_id 생성된 후) 내용 저장
  const addMutationForPost = useMutation({
    mutationFn: insertPostDetails,
    onSuccess: (data) => {
      const newPostId = data.id;
      if (newPostId) {
        handlePlaceSave(newPostId);
      }
    },
    onError: (error) => {
      console.error('Error saving post:', error);
    }
  });
  // 장소 저장
  const addMutationForPlace = useMutation({
    mutationFn: savePlaces,
    onError: (error) => {
      console.error('Error saving places:', error);
      alert('Failed to save places.');
    }
  });
  // 전체 데이터 수정
  const updateMutationForPost = useMutation({
    mutationFn: updatePostDetails,
    onSuccess: () => {
      handlePlaceSave(editId);
    },
    onError: (error) => {
      console.error('Error updating post:', error);
    }
  });
  // 장소 수정
  const updateMutationForPlace = useMutation({
    mutationFn: updatePlaces,
    onError: (error) => {
      console.error('Error saving places:', error);
      alert('Failed to save places.');
    }
  });

  const handleSavePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return;
    }

    if (!handleFormConfirm()) {
      return; // 폼이 유효하지 않으면 여기서 함수 종료
    }

    const postDetails = {
      id: postId,
      user_id: user?.id,
      name: user?.user_metadata.name,
      title,
      content,
      image,
      maxPeople,
      tags,
      price,
      selectedPrices,
      startDate,
      endDate
    };

    if (editId) {
      updateMutationForPost.mutate(postDetails);
    } else {
      addMutationForPost.mutate(postDetails);
    }
  };

  const handlePlaceSave = async (postId: string) => {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('Day ')) {
        const value = JSON.parse(sessionStorage.getItem(key)!);

        if (Array.isArray(value) && value.length > 0) {
          const placeData = {
            post_id: postId,
            day: key,
            places: value.map((place) => ({
              title: place.title,
              category: place.category,
              roadAddress: place.roadAddress,
              description: place.description
            })),
            lat: value.map((place) => place.latitude),
            long: value.map((place) => place.longitude),
            area: region
          };
          if (editId) {
            updateMutationForPlace.mutate(placeData);
          } else {
            addMutationForPlace.mutate(placeData);
          }
        }
      }
    }
    alert('Saved!');
    router.replace('/');
  };

  return (
    <form onSubmit={handleSavePost}>
      <div className="my-5 flex items-center">
        <div className="flex w-20 justify-center">
          <div className="icon-button">
            <button onClick={goToStep2} className="flex h-full w-full items-center justify-center">
              <IoChevronBack size={24} />
            </button>
          </div>
        </div>
        <div className="flex w-[199px] flex-col items-center">
          <h1 className="text-lg font-bold">{region}</h1>
          <p>{formatDateRange(startDate, endDate)}</p>
        </div>
        <button className="flex w-20 justify-center font-medium text-[#FF7029]" onClick={handleCancel}>
          Done
        </button>
      </div>

      <div className="mx-5 flex flex-col gap-5">
        {/* 제목, 내용 입력 폼 */}
        <div className="mt-7 flex flex-col items-center gap-5">
          <div className="w-[320px]">
            <label className="font-semibold">Tour title</label>
            <input
              className="mt-2 h-[48px] w-full rounded-xl bg-grayscale-50 p-4"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="w-[320px]">
            <label className="font-semibold">Introduction</label>
            <textarea
              className="mt-2 h-[209px] w-full resize-none rounded-2xl bg-grayscale-50 p-4"
              placeholder="You can write up to 500 characters.
            &#10;
            1. how much you lived in that area?
            &#10;
            2. promote the features of your course."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        {/* 이미지 등록 */}
        <hr className="my-5" />
        <div>
          <div className="flex items-center">
            <label
              htmlFor="input-file"
              className="mr-2 flex h-[100px] w-[100px] cursor-pointer items-center justify-center rounded-lg bg-grayscale-50"
            >
              <TbPhoto className="h-[28px] w-[28px]" />
            </label>
            {image && (
              <div className="relative">
                <Image
                  src={image}
                  alt="uploaded"
                  width={100}
                  height={100}
                  className="bg-grayscale-5 h-[100px] w-[100px] rounded-lg"
                />
                <button
                  className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-2 border-grayscale-50 bg-white font-semibold"
                  onClick={handleImageRemove}
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
            )}
          </div>
          <input type="file" id="input-file" onChange={handleImageAdd} className="hidden" />
        </div>

        {/* 최대 인원 작성 */}
        <hr className="my-5" />
        <div>
          <h1 className="text-xl font-semibold">Maximum people</h1>
          <div className="flex items-center">
            <LuUsers className="mr-3 size-8 pt-2" />
            <input
              type="number"
              value={maxPeople === undefined ? '' : maxPeople}
              onChange={handleMaxPeopleAdd}
              placeholder="5"
              className="mt-2 h-[48px] w-full rounded-xl bg-grayscale-50 p-4"
            />
          </div>
        </div>

        {/* 투어 태그 선택 */}
        <hr className="my-5" />
        <div>
          <h1 className="text-xl font-semibold">Tour theme</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {tagData.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 ${tags.includes(item) ? 'bg-primary-300 text-white' : 'bg-grayscale-50 font-medium text-black'}`}
                onClick={(e) => toggleTag(item, e)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 투어 금액 체크박스 선택 */}
        <hr className="my-5" />
        <div>
          <h1 className="mb-4 text-xl font-semibold">What this tour offers</h1>
          <div className="flex w-full flex-col gap-4">
            {prices.map((item) => (
              <label key={item} className="flex justify-between">
                {item}
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(item)}
                  onChange={() => togglePrice(item)}
                  className="mr-2 size-6 appearance-none rounded border border-grayscale-100 text-center checked:border-transparent checked:bg-primary-300 checked:before:text-white checked:before:content-['✔']"
                />
              </label>
            ))}
          </div>
        </div>

        {/* 투어 금액 작성 */}
        <hr className="my-5" />
        <div>
          <h1 className="mb-4 flex items-end text-xl">
            <p className="font-semibold">Tour cost</p>
            <p className="text-sm">/Person</p>
          </h1>
          <div className="flex items-center">
            <BiDollar className="mr-3 size-8 pt-2" />
            <input
              type="number"
              value={price}
              onChange={handlePriceAdd}
              placeholder="50"
              className="mt-2 h-[48px] w-full rounded-xl bg-grayscale-50 p-4"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto my-5 h-14 w-[320px] rounded-2xl bg-primary-300 p-2 text-lg font-semibold text-white"
        >
          Done
        </button>
      </div>
    </form>
  );
};

export default Write;
