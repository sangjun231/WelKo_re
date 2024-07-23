// utils/authService.ts
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 이메일 유효성 검사 함수
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사 함수
const validatePassword = (password: string): boolean => {
  // 최소 하나의 영문자, 하나의 숫자, 하나의 특수 문자를 포함하는지 확인
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// 로그인
export const handleLogin = async (
  email: string,
  password: string,
  router: any,
  setError: (message: string) => void
) => {
  const supabase = createClient();

  // 클라이언트 사이드 유효성 검사
  if (!email) {
    return toast.error('이메일을 입력하세요!');
  }
  if (!password) {
    return toast.error('비밀번호를 입력하세요!');
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
      setError(signInError.message);
    }
  } else {
    toast.success('로그인 되었습니다.');
    router.push('/');
  }
};

// 회원가입
export const handleSignUp = async (
  email: string,
  password: string,
  name: string,
  router: any,
  setError: (message: string) => void
) => {
  const supabase = createClient();

  if (!email || !password || !name) {
    return toast.error('빈칸을 모두 채워주세요!');
  }

  // 클라이언트 사이드 유효성 검사
  if (!validateEmail(email)) {
    return toast.error('유효한 이메일 주소를 입력하세요!(꼭 .com 으로 끝나는 이메일이어야 합니다!)');
  }
  if (!validatePassword(password)) {
    return toast.error('비밀번호는 최소 8자 이상, 영문자, 숫자, 특수 문자를 포함해야 합니다!');
  }

  // 이메일과 닉네임 중복 체크
  const { data: emailExist, error: emailError } = await supabase.from('users').select('id').eq('email', email).single();

  if (emailExist) {
    return toast.error('이미 사용 중인 이메일입니다!');
  }

  const { data: nameExist, error: nameError } = await supabase.from('users').select('id').eq('name', name).single();

  if (nameExist) {
    return toast.error('이미 사용 중인 닉네임입니다!');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) {
    setError(error.message);
  } else {
    toast.success('회원가입 성공!');
    router.push('/');
  }
};

// 로그아웃
export const handleLogout = async (router: any) => {
  const supabase = createClient();
  await supabase.auth.signOut();
  toast.success('로그아웃 되었습니다.');
  router.push('/');
};

// 구글로그인
export const googleLogin = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  if (error) {
    console.error('Error during Google login:', error);
    return;
  }
};
