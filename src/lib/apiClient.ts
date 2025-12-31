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
  response => response,
  error => {
    // 디버깅 로그 (개발 환경에서만 상세 출력)
    const payload = error.response?.data ?? error.message;
    const status = error.response?.status;
    const url = error.config?.url;
    if (process.env.NODE_ENV === "development") {
      console.error(`[API Error] ${status ?? "unknown"} ${url ?? ""}`, payload);
    }

    const detail = error.response?.data?.detail;
    if (detail) {
      error.message = typeof detail === "string" ? detail : JSON.stringify(detail);
    } else if (status) {
      error.message = `요청에 실패했습니다. (status: ${status})`;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
