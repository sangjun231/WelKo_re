'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

// 유저 데이터 타입 정의
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // 추가적인 필드가 있을 경우를 대비한 인덱스 시그니처
}

const BackOffice = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    Modal.setAppElement('body'); // 'body'를 AppElement로 설정

    const fetchAllUsers = async () => {
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

      const { data: allUsersData, error: allUsersError } = await supabase.from('users').select('*');

      if (allUsersError) {
        console.error('Error fetching all users:', allUsersError);
        setError(allUsersError.message);
        return null;
      }

      return allUsersData;
    };

    const getUsers = async () => {
      const allUsers = await fetchAllUsers();
      if (allUsers) {
        setUsers(allUsers);
      }
    };

    getUsers();
  }, [supabase]);

  // 날짜를 원하는 형식으로 변환하는 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
  };

  // 사용자 수정 핸들러
  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditedUser({ name: user.name, email: user.email });
  };

  // 수정된 사용자 저장 핸들러
  const handleSave = async () => {
    if (editUser) {
      try {
        const { error } = await supabase.from('users').update(editedUser).eq('id', editUser.id);
        if (error) throw error;

        setUsers(users.map((user) => (user.id === editUser.id ? { ...user, ...editedUser } : user)));
        toast.success('User updated successfully');
        setEditUser(null);
        setEditedUser({});
      } catch (error) {
        toast.error(`Failed to update user: ${(error as Error).message}`);
      }
    }
  };

  // 사용자 삭제 핸들러
  const handleDelete = async () => {
    if (deleteUserId) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', deleteUserId);
        if (error) throw error;

        setUsers(users.filter((user) => user.id !== deleteUserId));
        toast.success('User deleted successfully');
        setDeleteUserId(null);
      } catch (error) {
        toast.error(`Failed to delete user: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="mb-4 text-2xl font-bold">유저 게시글</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <input type="text" placeholder="검색" className="rounded border border-gray-400 p-2" />
      </div>
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">NICKNAME</th>
            <th className="border-b px-4 py-2">EMAIL</th>
            <th className="border-b px-4 py-2">CREATED_AT</th>
            <th className="border-b px-4 py-2">UPDATED_AT</th>
            <th className="border-b px-4 py-2">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border-b px-4 py-2">{user.name}</td>
              <td className="border-b px-4 py-2">{user.email}</td>
              <td className="border-b px-4 py-2">{formatDate(user.created_at)}</td>
              <td className="border-b px-4 py-2">{formatDate(user.updated_at)}</td>
              <td className="border-b px-4 py-2">
                <button onClick={() => handleEdit(user)} className="mr-2 rounded bg-blue-500 px-2 py-1 text-white">
                  수정
                </button>
                <button onClick={() => setDeleteUserId(user.id)} className="rounded bg-red-500 px-2 py-1 text-white">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={editUser !== null}
        onRequestClose={() => setEditUser(null)}
        contentLabel="Edit User"
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
        <h2 className="mb-4 text-xl">Edit User</h2>
        <label className="mb-2 block">
          Name:
          <input
            type="text"
            value={editedUser.name || ''}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
            className="w-full rounded border border-gray-400 p-2"
          />
        </label>
        <label className="mb-2 block">
          Email:
          <input
            type="email"
            value={editedUser.email || ''}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            className="w-full rounded border border-gray-400 p-2"
          />
        </label>
        <button onClick={handleSave} className="mr-2 rounded bg-blue-500 px-4 py-1 text-white">
          Save
        </button>
        <button onClick={() => setEditUser(null)} className="rounded bg-gray-300 px-4 py-1">
          Cancel
        </button>
      </Modal>
      <Modal
        isOpen={deleteUserId !== null}
        onRequestClose={() => setDeleteUserId(null)}
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
        <button onClick={() => setDeleteUserId(null)} className="rounded bg-gray-300 px-4 py-1">
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default BackOffice;
