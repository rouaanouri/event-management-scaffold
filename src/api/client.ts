import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/stores/authStore";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.error(
    "متغيّر البيئة VITE_API_URL غير معرَّف. يجب إنشاء ملف .env استناداً إلى .env.example",
  );
}

export const apiClient = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    const config = error.config as (typeof error.config & { __retried?: boolean }) | undefined;
    const isRetriableNetworkError = !error.response && config?.method === "get";

    if (isRetriableNetworkError && config && !config.__retried) {
      config.__retried = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return apiClient(config);
    }

    return Promise.reject(error);
  },
);
