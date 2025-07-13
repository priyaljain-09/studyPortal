import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../store';
import {IApplicationState, LoginCredentials} from '../../types/application';
import {api} from '../../api/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const initialState: IApplicationState = {
  isLoading: false,
  successLogin: false,
  type: "",
  toastMessage: "",
  showToast: false,
  showWarningModal: false,
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
    setShowToast(state, action: PayloadAction<any>) {
      state.showToast = action.payload.show;
      state.toastMessage = action.payload.toastMessage;
      state.type = action.payload.type;
    },
    setWarningModal(state, action: PayloadAction<any>) {
      state.showWarningModal = action.payload.show;
      state.toastMessage = action.payload.toastMessage;
      state.type = action.payload.type;
    },
  },
});

export const {setIsLoading, loginsuccess, setShowToast, setWarningModal} = slice.actions;

export default slice.reducer;

export function login({ email, password }: LoginCredentials) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.post('/users/login/', { email, password });
      const { access } = response.data;
      await AsyncStorage.setItem('accessToken', access);
      dispatch(loginsuccess(response.data));
      return response.status;
    } catch (error: any) {
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: "Something went wrong!",
        })
      ); 
       } finally {
      dispatch(setIsLoading(false));
    }
  };
}

