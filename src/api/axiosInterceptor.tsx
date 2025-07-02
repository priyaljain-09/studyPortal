import axios, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
  } from "axios";
  
  import { Platform } from "react-native";
  
  const baseURL =
    Platform.OS === "android"
      ? "http://10.0.2.2:8000/api"
      : "http://localhost:8000/api";
  
  // ✅ Create Axios instance with default headers
  export const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  
  // ✅ Request interceptor (optional)
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // config.headers["Authorization"] = `Bearer ${token}`; ← Add token later if needed
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  // ✅ Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 403 or other status codes here
      console.log("❌ API Error:", error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );
  