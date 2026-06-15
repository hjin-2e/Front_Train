import axios from 'axios';

// 환경변수에서 백엔드 주소를 가져옵니다. 
// 없으면 로컬 주소(http://localhost:8080)를 기본값으로 사용합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    const token = localStorage.getItem('cognito_sub');
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

