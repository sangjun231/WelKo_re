export const API_MYPAGE_PROFILE = (userId: string) => `/api/mypage/${userId}/profile`;
export const API_MYPAGE_PROFILE_PASSWORD = (userId: string) => `/api/mypage/${userId}/profile/password`;
export const API_MYPAGE_LIKES = (userId: string) => `/api/mypage/${userId}/profile/postlikes`;
export const API_MYPAGE_POST = (postId: string) => `/api/post`;
export const API_MYPAGE_REVIEWS = (userId: string) => `/api/mypage/${userId}/reviews`;

export const API_POST_DETAILS = (postId: string) => `/api/mypage/${postId}/chatpost`;
