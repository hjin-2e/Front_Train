import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 💡 [방어 코드] 프로토콜(http:// 또는 https://)이 누락된 도메인일 경우, 자동으로 https:// 를 붙여 절대 경로로 변환
let finalBaseUrl = API_BASE_URL.trim();
if (
  finalBaseUrl &&
  !finalBaseUrl.startsWith('http://') &&
  !finalBaseUrl.startsWith('https://') &&
  !finalBaseUrl.startsWith('/')
) {
  finalBaseUrl = `https://${finalBaseUrl}`;
}

export const apiClient = axios.create({
  baseURL: finalBaseUrl,
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

