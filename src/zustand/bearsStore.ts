import { create } from 'zustand';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase/client';

interface AuthStore {
  user: any;
  isAuthenticated: boolean;
  errorMessage: string;
  setUser: (user: any) => void;
  login: (email: string, password: string, router: any) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null, // 초기 사용자 상태는 null
  isAuthenticated: false,
  errorMessage: '',
  setUser: (user: any) => set({ user, isAuthenticated: !!user }),
  login: async (email: string, password: string, router: any): Promise<void> => {
    const supabase = createClient();

    // 클라이언트 사이드 유효성 검사
    if (!email) {
      toast.error('이메일을 입력하세요!');
      return;
    }
    if (!password) {
      toast.error('비밀번호를 입력하세요!');
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Sign-in error:', signInError); // 에러 로깅
      // 에러 메시지에 따라 처리
      if (signInError.message.toLowerCase().includes('invalid login credentials')) {
        toast.error('잘못된 로그인 자격 증명입니다.');
      } else {
        set({ errorMessage: signInError.message });
      }
    } else {
      toast.success('로그인 되었습니다.');
      set({ user: data.user, isAuthenticated: true, errorMessage: '' });
      router.push('/');
    }
  }
}));

export default useAuthStore;
