import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls will fail until the env is configured.");
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(config => {
  // Guard for SSR/Next.js server renders
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 디버깅 로그 (응답이 없을 때도 메시지 출력)
    const payload = error.response?.data ?? error.message;
    console.error("API Error:", payload);

    const detail = error.response?.data?.detail;
    if (detail) {
      error.message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
