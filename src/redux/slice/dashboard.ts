import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../store';
import {IApplicationState, LoginCredentials} from '../../types/application';
import {api} from '../../api/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { setIsLoading } from './application';
import { IDashboardState } from '../../types/dashboard';

const initialState: IDashboardState = {
    allSubjects: {},
    allAnnouncements: {},
    announcemntDetail: {},
    allModules: {},
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    getDashboardSubjects(state, action: PayloadAction<any>) {
      state.allSubjects = action.payload;
    },
    getAllAnnouncements(state, action: PayloadAction<any>){
      state.allAnnouncements = action.payload;
    },
    getAnnouncement(state, action: PayloadAction<any>){
      state.announcemntDetail = action.payload;
    },
    getAllModules(state, action: PayloadAction<any>){
      state.allModules = action.payload;
    },
  },
});

export const {getDashboardSubjects, getAllAnnouncements,getAnnouncement, getAllModules} = slice.actions;

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

export function fetchAllAnnouncementBySubject(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/subjects/${id}/announcements/`);
      dispatch(getAllAnnouncements(response.data));
      return response.status;
    } catch (error: any) {
        console.log('❌ Error:', error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchAllAnnouncementById(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/announcements/${id}/`);
      dispatch(getAnnouncement(response.data));
      return response.status;
    } catch (error: any) {
        console.log('❌ Error:', error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchModaulesBySubject(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/subjects/${id}/modules/`);
      dispatch(getAllModules(response.data));
      return response.status;
    } catch (error: any) {
        console.log('❌ Error:', error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}