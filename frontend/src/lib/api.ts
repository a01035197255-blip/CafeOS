import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // JWT를 붙이지 않을 공개 API
    const publicUrls = [
      "/auth/login",
      "/auth/signup",
      "/auth/email/send",
      "/auth/reissue",
      "/auth/password/send",
      "/auth/password/verify",
      "/auth/password/reset",
    ];

    const isPublic = publicUrls.some((url) =>
      config.url?.startsWith(url)
    );

    // 공개 API가 아닐 때만 JWT 추가
    if (!isPublic) {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);