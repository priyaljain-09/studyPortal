import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

const USE_LOCAL_SERVER = false; // Set to true when you want to test locally

// const baseURL = __DEV__
//   ? USE_LOCAL_SERVER
//     ? Platform.OS === "android"
//       ? "http://10.0.2.2:8000/api" // Android emulator
//       : "http://192.168.1.5:8000/api" // iOS/real device
//     : "https://classroom-portal.onrender.com/api" // Deployed URL
//   : "https://classroom-portal.onrender.com/api"; // Production

const baseURL = "https://classroom-portal.onrender.com/api";
console.log("baseurl", baseURL)

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token && !config.url?.includes("/login") && !config.url?.includes("/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Global error handling (for debugging or toast/snackbar handling)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;
    console.log("❌ API Error:", status, data);
    if (status === 401) {
      console.log("🔒 Unauthorized – token may be expired or invalid.");
    }

    return Promise.reject(error);
  }
);
