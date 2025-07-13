import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../utils/navigationService';

const baseURL = 'https://classroom-portal.onrender.com/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (
      token &&
      !config.url?.includes('/login') &&
      !config.url?.includes('/register')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ✅ Global error handling (for debugging or toast/snackbar handling)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;
    console.log('❌ API Error:', status, data);
    if (status === 401) {
      console.log('🔒 Unauthorized – token may be expired or invalid.');
      await AsyncStorage.removeItem('accessToken');
      navigate('Login');
    }

    return Promise.reject(error);
  },
);
