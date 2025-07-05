import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../store';
import {IApplicationState, LoginCredentials} from '../../types/application';
import {api} from '../../api/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const initialState: IApplicationState = {
  isLoading: false,
  successLogin: false,
};

const slice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    loginsuccess(state, action: PayloadAction<boolean>) {
      state.successLogin = action.payload;
    },
  },
});

export const {setIsLoading, loginsuccess} = slice.actions;

export default slice.reducer;

export function login({ email, password }: LoginCredentials) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      console.log("response", {email, password},)
      const response = await api.post('/users/login/', { email, password });
      const { access } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      dispatch(loginsuccess(response.data));
      return response.status;
    } catch (error: any) {
      console.log('❌ called:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

