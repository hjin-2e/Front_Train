import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'team-train.cloud' || hostname === 'www.team-train.cloud') {
      return 'https://api.team-train.cloud';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CORS 환경에서 쿠키/세션 전송에 필수
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 로컬 스토리지에 로그인 정보가 존재할 경우 Authorization 헤더로 자동 부착
apiClient.interceptors.request.use(
  (config) => {
    // Cognito 실 JWT 우선, 없으면 Mock용 cognito_sub 폴백
    const token = localStorage.getItem('cognito_id_token')
                || localStorage.getItem('cognito_sub');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

