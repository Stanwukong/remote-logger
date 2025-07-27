import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "./auth.service";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);
