import BackButton from '@/components/common/Button/BackButton';
import useAuthStore from '@/zustand/bearsStore';
import usePostStore from '@/zustand/postStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import WriteBtn from '/public/icons/tabler-icon-pencil.svg';
import DeleteBtn from '/public/icons/tabler-icon-trash.svg';
import LikeBtn from '/public/icons/tabler-icon-heart.svg';
import IconHome from '/public/icons/navbar_icons/icon_home.svg';
import { DeletePost } from '../../../postpage/[id]/_components/PostEdit';

const Likes = () => {
  const { id: postId } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const { post } = usePostStore((state) => ({
    post: state.post
  }));
  const [liked, setLiked] = useState(false);

  // 좋아요 상태를 가져오는 함수
  const fetchLikeStatus = async (): Promise<boolean> => {
    const response = await axios.get<{ exists: boolean }>(`/api/detail/likes/${postId}`, {
      headers: { 'user-id': user.id }
    });
    return response.data.exists;
  };

  // 좋아요 상태를 업데이트하는 함수
  const toggleLikeStatus = async (): Promise<void> => {
    if (liked) {
      await axios.delete(`/api/detail/likes/${postId}`, { data: { userId: user.id } });
    } else {
      await axios.post(`/api/detail/likes/${postId}`, { userId: user.id });
    }
  };

  const { data, isError, isPending, refetch } = useQuery<boolean>({
    queryKey: ['likeStatus', postId, user?.id],
    queryFn: fetchLikeStatus,
    enabled: !!postId && !!user?.id
  });

  useEffect(() => {
    if (data !== undefined) {
      setLiked(data);
    }
  }, [data]);

  const likeMutation = useMutation<void, Error>({
    mutationFn: toggleLikeStatus,
    onSuccess: () => {
      refetch();
    }
  });

  const handleLike = () => {
    if (!user) {
      alert('좋아요를 누르기 위해서는 로그인이 필요합니다.');
      return;
    }
    if (isPending) return;
    likeMutation.mutate();
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error fetching like status</div>;

  const handleDelete = DeletePost();

  return (
    <div className="absolute left-0 right-0 top-2 z-10 flex items-center justify-between px-4">
      <BackButton />
      <div className="flex space-x-4">
        {post && post.user_id === user.id && (
          <>
            <Link href={`/postpage/${postId}`}>
              <button className="icon-button">
                <WriteBtn alt="WritePencil" width={24} height={24} />
              </button>
            </Link>
            <button className="icon-button" onClick={() => handleDelete(postId)}>
              <DeleteBtn alt="DeleteBtn" width={24} height={24} />
            </button>
          </>
        )}
        <div>
          <button onClick={handleLike} className="icon-button">
            {liked ? <LikeBtn size={24} color="red" fill="red" /> : <LikeBtn size={24} />}
          </button>
        </div>
        <Link href="/">
          <button className="icon-button">
            <IconHome alt="Home" width={24} height={24} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Likes;
