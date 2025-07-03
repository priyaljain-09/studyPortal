import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../store';
import {IApplicationState, LoginCredentials} from '../../types/application';
import {api} from '../../api/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { setIsLoading } from './application';
import { IDashboardState } from '../../types/dashboard';

const initialState: IDashboardState = {
    allSubjects: {},
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    getDashboardSubjects(state, action: PayloadAction<any>) {
      state.allSubjects = action.payload;
    },
  },
});

export const {getDashboardSubjects} = slice.actions;

export default slice.reducer;

export function fetchDashboardSubject() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get('/users/student/dashboard/');
      dispatch(getDashboardSubjects(response.data));
      return response.status;
    } catch (error: any) {
        console.log('❌ Error:', error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}
