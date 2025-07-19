import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../store';
import {api} from '../../api/axiosInterceptor';
import { setIsLoading, setShowToast } from './application';
import { IDashboardState } from '../../types/dashboard';

const initialState: IDashboardState = {
    allSubjects: {},
    allAnnouncements: {},
    announcemntDetail: {},
    allModules: {},
    chapterDetail: {},
    allAssignment: {},
    allQuestions: {},
    allDiscussion: {},
    discussionDetails: {},
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
    getChaperDetail(state, action: PayloadAction<any>){
      state.chapterDetail = action.payload;
    },
    getAllAssigment(state, action: PayloadAction<any>){
      state.allAssignment = action.payload;
    },
    getAssigmentQuestions(state, action: PayloadAction<any>){
      state.allQuestions = action.payload;
    },
    getDiscussionList(state, action: PayloadAction<any>){
      state.allDiscussion = action.payload;
    },
    getDiscussionDetail(state, action: PayloadAction<any>){
      state.discussionDetails = action.payload;
    },
  },
});

export const {getDashboardSubjects, getAllAnnouncements,getAnnouncement, getAllModules, getChaperDetail, getAllAssigment, getAssigmentQuestions, getDiscussionList, getDiscussionDetail} = slice.actions;

export default slice.reducer;

export function fetchDashboardSubject() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get('/users/student/dashboard/');
      dispatch(getDashboardSubjects(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
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
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
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
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
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
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchChapterById(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/chapter/${id}/`);
      dispatch(getChaperDetail(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchAssignmentBySubject(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/assignments/subject/${id}/`);
      dispatch(getAllAssigment(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchAssigmentQuestions(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/assignments/${id}/`);
      dispatch(getAssigmentQuestions(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function submitAssimentQuestion(id: number,data: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.post(`/users/assignments/${id}/submit/mixed/`, data);
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchDiscussionBySubject(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/discussions/subject/${id}/`);
      dispatch(getDiscussionList(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function fetchDiscussionById(id: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.get(`/users/discussions/${id}/`);
      dispatch(getDiscussionDetail(response.data));
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}

export function submitDiscussionReply(id: number,data: any) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await api.post(`/users/discussions/${id}/reply/`, data);
      return response.status;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail || error?.message || "Something went wrong!";
      dispatch(
        setShowToast({
          show: true,
          type: "error",
          toastMessage: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };
}