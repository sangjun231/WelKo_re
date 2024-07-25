'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';

// 게시글 데이터 타입 정의
interface Post {
  id: string;
  name: string;
  title: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // 추가적인 필드가 있을 경우를 대비한 인덱스 시그니처
}

const PosterManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editedPost, setEditedPost] = useState<Partial<Post>>({});
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    Modal.setAppElement('body'); // 'body'를 AppElement로 설정

    const fetchAllPosts = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError(userError.message);
        return null;
      }

      if (!user) {
        console.error('No user found');
        setError('사용자가 없습니다.');
        return null;
      }

      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (userFetchError) {
        console.error('Error fetching user data:', userFetchError);
        setError(userFetchError.message);
        return null;
      }

      if (!userData.is_admin) {
        console.error('Access denied: Not an admin');
        setError('접근이 거부되었습니다: 관리자가 아닙니다.');
        return null;
      }

      const { data: allPostsData, error: allPostsError } = await supabase.from('posts').select('*');

      if (allPostsError) {
        console.error('Error fetching all posts:', allPostsError);
        setError(allPostsError.message);
        return null;
      }

      return allPostsData;
    };

    const getPosts = async () => {
      const allPosts = await fetchAllPosts();
      if (allPosts) {
        setPosts(allPosts);
      }
    };

    getPosts();
  }, [supabase]);

  // 날짜를 원하는 형식으로 변환하는 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  // 게시글 수정 핸들러
  const handleEdit = (post: Post) => {
    setEditPost(post);
    setEditedPost({ name: post.name, title: post.title });
  };

  // 수정된 게시글 저장 핸들러
  const handleSave = async () => {
    if (editPost) {
      try {
        const { error } = await supabase.from('posts').update(editedPost).eq('id', editPost.id);
        if (error) throw error;

        setPosts(posts.map((post) => (post.id === editPost.id ? { ...post, ...editedPost } : post)));
        toast.success('Post updated successfully');
        setEditPost(null);
        setEditedPost({});
      } catch (error) {
        toast.error(`Failed to update post: ${(error as Error).message}`);
      }
    }
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (deletePostId) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', deletePostId);
        if (error) throw error;

        setPosts(posts.filter((post) => post.id !== deletePostId));
        toast.success('Post deleted successfully');
        setDeletePostId(null);
      } catch (error) {
        toast.error(`Failed to delete post: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="mb-4 text-2xl font-bold">포스터 관리</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input type="text" placeholder="검색" className="rounded border border-gray-400 p-2" />
      </div>
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">NICKNAME</th>
            <th className="border-b px-4 py-2 text-left">TITLE</th>
            <th className="border-b px-4 py-2 text-left">CREATED_AT</th>
            <th className="border-b px-4 py-2 text-left">UPDATED_AT</th>
            <th className="border-b px-4 py-2 text-left">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="border-b px-4 py-2">{post.name}</td>
              <td className="border-b px-4 py-2">{post.title}</td>
              <td className="border-b px-4 py-2">{formatDate(post.created_at)}</td>
              <td className="border-b px-4 py-2">{formatDate(post.updated_at)}</td>
              <td className="border-b px-4 py-2">
                <button onClick={() => handleEdit(post)} className="mr-2 rounded bg-blue-500 px-2 py-1 text-white">
                  수정
                </button>
                <button onClick={() => setDeletePostId(post.id)} className="rounded bg-red-500 px-2 py-1 text-white">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={editPost !== null}
        onRequestClose={() => setEditPost(null)}
        contentLabel="Edit Post"
        style={{
          content: {
            width: '300px',
            height: '300px',
            margin: 'auto',
            padding: '20px',
            textAlign: 'center'
          }
        }}
      >
        <h2 className="mb-4 text-xl">Edit Post</h2>
        <label className="mb-2 block">
          Name:
          <input
            type="text"
            value={editedPost.name || ''}
            onChange={(e) => setEditedPost({ ...editedPost, name: e.target.value })}
            className="w-full rounded border border-gray-400 p-2"
          />
        </label>
        <label className="mb-2 block">
          Title:
          <input
            type="text"
            value={editedPost.title || ''}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
            className="w-full rounded border border-gray-400 p-2"
          />
        </label>
        <button onClick={handleSave} className="mr-2 rounded bg-blue-500 px-4 py-1 text-white">
          Save
        </button>
        <button onClick={() => setEditPost(null)} className="rounded bg-gray-300 px-4 py-1">
          Cancel
        </button>
      </Modal>
      <Modal
        isOpen={deletePostId !== null}
        onRequestClose={() => setDeletePostId(null)}
        contentLabel="Delete Confirmation"
        style={{
          content: {
            width: '300px',
            height: '150px',
            margin: 'auto',
            padding: '20px',
            textAlign: 'center'
          }
        }}
      >
        <h2 className="mb-4 text-xl">삭제하시겠습니까?</h2>
        <button onClick={handleDelete} className="mr-2 rounded bg-red-500 px-4 py-1 text-white">
          Yes
        </button>
        <button onClick={() => setDeletePostId(null)} className="rounded bg-gray-300 px-4 py-1">
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default PosterManagement;
