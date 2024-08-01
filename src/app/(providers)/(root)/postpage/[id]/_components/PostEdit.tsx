import axios from 'axios';
import { useRouter } from 'next/navigation';

//수정 핸들러

// 삭제 핸들러
export const DeletePost = () => {
  const router = useRouter();
  const handleDelete = async (postId: string) => {
    if (!postId) {
      alert('Post ID not found');
      return;
    }
    const userConfirmed = confirm('Do you want to delete this?');
    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.delete('/api/post', { data: { post_id: postId } });
      alert('Deleted!');
      router.replace('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };
  return handleDelete;
};
